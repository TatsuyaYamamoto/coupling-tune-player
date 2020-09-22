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
  readonly duration = 0;
  readonly currentTime = 0;

  private lastCheckTime: number | null = null;
  private intervalId: NodeJS.Timer | number | null = null;
  private audioBufferSourceNodes: AudioBufferSourceNode[] = [];

  public get playing(): boolean {
    return this._playing;
  }

  public get loading(): boolean {
    return this._loading;
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

    const [left, right] = await Promise.all(
      arrayBuffers.map(
        (arrayBuffer) =>
          new Promise<{
            audioBuffer: AudioBuffer;
            analyzeResult: AnalyzeResult;
          }>((resolve, reject) => {
            context.decodeAudioData(
              arrayBuffer,
              (audioBuffer) =>
                resolve({
                  audioBuffer,
                  analyzeResult: analyzeBpm(audioBuffer),
                }),
              (e) => reject(e)
            );
          })
      )
    );

    this.startSyncPlay(
      [
        {
          audioBuffer: left.audioBuffer,
          startPosition: left.analyzeResult.startPosition,
        },
        {
          audioBuffer: right.audioBuffer,
          startPosition: right.analyzeResult.startPosition,
        },
      ],
      this.currentTime
    ).then(() => {
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
      this.emit("update", { currentTime: time });
      return;
    }

    const now = context.currentTime;
    if (this.lastCheckTime == null) {
      this.lastCheckTime = now;
      return;
    }

    const add = now - this.lastCheckTime;
    this.lastCheckTime = now;

    this.emit("update", {
      currentTime: this.currentTime + add,
    });
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
    console.log("CouplingPlayer#startSyncPlay");

    // TODO: Check to arrange gain is required?
    const gainNode = context.createGain();
    gainNode.gain.value = 0.8;

    this.audioBufferSourceNodes = sources
      .map((source) => {
        const audioSource = context.createBufferSource();
        audioSource.buffer = source.audioBuffer;

        return audioSource;
      })
      .map((source) => {
        source.connect(gainNode);

        return source;
      });

    gainNode.connect(context.destination);

    const endPromises = this.audioBufferSourceNodes.map((source) => {
      return new Promise((resolve) => {
        source.onended = () => {
          resolve();
        };
      });
    });

    let leftAudioOffset = offset;
    let rightAudioOffset = offset;
    const [
      { startPosition: leftStartPosition },
      { startPosition: rightStartPosition },
    ] = sources;
    const [leftAudioSource, rightAudioSource] = this.audioBufferSourceNodes;

    const diff = leftStartPosition - rightStartPosition;

    if (0 < diff) {
      leftAudioOffset += diff;
    } else {
      rightAudioOffset += -1 * diff;
    }

    // Start sync play!
    leftAudioSource.start(0, leftAudioOffset);
    rightAudioSource.start(0, rightAudioOffset);
    console.log(
      `Start sync play. Left offset: ${leftAudioOffset}, right offset ${rightAudioOffset}.`
    );

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
