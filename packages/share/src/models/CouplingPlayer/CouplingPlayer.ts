import { EventEmitter } from "eventemitter3";

import { context } from "./AudioContext";
import { analyzeBpm, AnalyzeResult } from "./BpmAnalyzer";

export type CouplingPlayerEventTypes =
  | "play-request"
  | "play"
  | "pause"
  | "update"
  | "end";

export class CouplingPlayer extends EventEmitter<CouplingPlayerEventTypes> {
  private _playing = false;
  private _loading = false;
  private _currentTime = 0;
  readonly duration = 0;

  private lastCheckTime: number | null = null;
  private intervalId: NodeJS.Timer | number | null = null;
  private audioBufferSourceNodes: AudioBufferSourceNode[] = [];

  public get playing(): boolean {
    return this._playing;
  }

  public get loading(): boolean {
    return this._loading;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public constructor() {
    super();
  }

  public async play(arrayBuffers: ArrayBuffer[]) {
    console.log("CouplingPlayer#play");

    if (this.playing) {
      this.stopSyncPlay();
    }

    this.emit("play-request");
    this._loading = true;

    const sources = await Promise.all(
      arrayBuffers.map(
        (arrayBuffer) =>
          new Promise<{
            audioBuffer: AudioBuffer;
            startPosition: number;
          }>((resolve, reject) => {
            context.decodeAudioData(
              arrayBuffer,
              (audioBuffer) => {
                resolve({
                  audioBuffer,
                  startPosition: analyzeBpm(audioBuffer).startPosition,
                });
              },
              (e) => {
                reject(e);
              }
            );
          })
      )
    );

    this.startSyncPlay(sources, this.currentTime).then(() => {
      this.lastCheckTime = null;
      if (this.intervalId !== null) {
        clearInterval(this.intervalId as number);
      }
      this.intervalId = null;

      this.emit("end");
      this._playing = false;
    });

    this.emit("play");
    this._loading = false;
    this._playing = true;

    this.intervalId = setInterval(() => {
      this.updateCurrentTime();
    }, 500);
  }
  public pause() {
    console.log("CouplingPlayer#pause");

    if (!this.playing) {
      console.error("Player is not running.");
      return;
    }

    this.stopSyncPlay();

    this.emit("pause");
    this._playing = false;
  }
  public updateCurrentTime(time?: number) {
    if (typeof time !== "undefined") {
      this._currentTime = time;
      this.emit("update", { currentTime: this.currentTime });
      return;
    }

    const now = context.currentTime;
    if (this.lastCheckTime == null) {
      this.lastCheckTime = now;
      return;
    }

    const add = now - this.lastCheckTime;
    this.lastCheckTime = now;
    this._currentTime = this._currentTime + add;

    this.emit("update", { currentTime: this.currentTime });
  }

  /**
   * Play audio file synchronously.
   *
   * @param sources
   * @param offset
   * @private
   */
  private startSyncPlay(
    sources: { audioBuffer: AudioBuffer; startPosition: number }[],
    offset: number = 0
  ): Promise<void> {
    console.log(`CouplingPlayer#startSyncPlay, offset: ${offset}`);

    // 音量は入力の数に合わせて下げる
    const gainNode = context.createGain();
    gainNode.gain.value = 0.5 + 0.5 / sources.length;

    // 定位は左端(-1.0)から右端(+1.0)までに等間隔に配置する
    const space = 2.0 / (sources.length + 1);
    const pannerNodes = sources.map((_, index) => {
      const pannerNode = context.createStereoPanner();
      pannerNode.pan.value = -1.0 + space * (index + 1);
      pannerNode.connect(gainNode);
      return pannerNode;
    });

    this.audioBufferSourceNodes = sources.map((source, index) => {
      const pannerNode = pannerNodes[index];
      const audioSource = context.createBufferSource();
      audioSource.buffer = source.audioBuffer;
      audioSource.connect(pannerNode);
      return audioSource;
    });

    gainNode.connect(context.destination);

    const endPromises = this.audioBufferSourceNodes.map((source) => {
      return new Promise((resolve) => {
        source.onended = () => {
          resolve();
        };
      });
    });

    const minStartPosition = Math.min(...sources.map((s) => s.startPosition));

    const offsets = sources.map(({ startPosition }) => {
      const diff = startPosition - minStartPosition;
      return offset + diff;
    });

    // Start sync play!
    this.audioBufferSourceNodes.forEach((node, index) => {
      node.start(0, offsets[index]);
    });
    console.log(`Start sync play.`);

    return Promise.race(endPromises).then(() => {
      this.audioBufferSourceNodes = [];
    });
  }

  /**
   * Stop audio source.
   */
  private stopSyncPlay(): void {
    console.log("CouplingPlayer#stopSyncPlay");

    this.audioBufferSourceNodes.forEach((node) => {
      node.stop(0);
    });

    this.audioBufferSourceNodes = [];
  }
}
