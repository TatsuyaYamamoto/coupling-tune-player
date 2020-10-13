import { EventEmitter } from "eventemitter3";

import { analyzeBpm, AnalyzeResult } from "./BpmAnalyzer";

export type CouplingPlayerEventTypes = "play" | "pause" | "update" | "end";

const log = (message: string, ...data: any[]) => {
  console.log(`[CouplingPlayer] ${message}`, ...data);
};

export class CouplingPlayer extends EventEmitter<CouplingPlayerEventTypes> {
  public static INTERNAL_LOOPER_INTERVAL = 500;

  /**
   * AudioContext instance.
   * @see https://developer.mozilla.org/ja/docs/Web/API/AudioContext
   */
  private context: AudioContext = new (AudioContext ||
    (window as any).webkitAudioContext)();
  private _playing = false;
  private _currentTime = 0;
  private _duration = 0;

  private arrayBuffers: ArrayBuffer[];

  private lastCheckedContextTime: number | null = null;
  private intervalId: NodeJS.Timer | number | null = null;
  private audioBufferSourceNodes: AudioBufferSourceNode[] | null = null;
  private sources:
    | {
        audioBuffer: AudioBuffer;
        analyzedData: AnalyzeResult;
      }[]
    | null = null;

  public get playing(): boolean {
    return this._playing;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(time: number) {
    if (this.duration < time) {
      console.error(
        `provided time (${time}s) is over duration (${this.duration}s).`
      );
      return;
    }
    log("update current time", time);

    (async () => {
      const stopOnce = this.playing;
      if (stopOnce) {
        log("stop once");
        await this.internalStop();
      }

      this._currentTime = time;

      if (stopOnce) {
        log("re-play");
        await this.internalPlay();
      }

      this.emit("update", { currentTime: this.currentTime });
    })();
  }

  public get duration(): number {
    return this._duration;
  }

  public constructor(arrayBuffers: ArrayBuffer[]) {
    super();

    this.arrayBuffers = arrayBuffers;
  }

  public async play() {
    log(`try to start player, currentTime: ${this.currentTime}`);

    if (this.playing) {
      log("stop sync-play first.");
      await this.internalStop();
    }

    if (!this.sources) {
      this.sources = await this.decodeAudioSources(this.arrayBuffers);
      this._duration = this.sources[0].audioBuffer.duration;
      log("player sources are decoded.");
    }

    await this.internalPlay();

    log(`success to start player. duration: ${this.duration}sec`);

    log("event - play");
    this.emit("play");
  }

  public async pause() {
    log(`pause`);

    if (!this.playing) {
      console.error(`player is not running.`);
      return;
    }

    await this.internalStop();

    log("event - pause");
    this.emit("pause");
  }

  private async internalPlay() {
    if (!this.sources) {
      log("audio source is empty.");
      return;
    }

    this.startSyncPlay(this.sources, this.currentTime);
    this.intervalId = setInterval(() => {
      this.onPlayerUpdated();
    }, CouplingPlayer.INTERNAL_LOOPER_INTERVAL);
    log("start internal looper.", this.intervalId);
    this._playing = true;
  }

  private async internalStop() {
    if (this.intervalId !== null) {
      log("stop internal looper.", this.intervalId);
      clearInterval(this.intervalId as number);
    }
    this.lastCheckedContextTime = null;
    this.intervalId = null;
    this._playing = false;

    await this.stopSyncPlay();
  }

  /**
   * Play audio file synchronously.
   *
   * @param sources
   * @param offset
   * @private
   */
  private startSyncPlay(
    sources: { audioBuffer: AudioBuffer; analyzedData: AnalyzeResult }[],
    offset: number = 0
  ): void {
    log(`startSyncPlay offset: ${offset}`);

    // 音量は入力の数に合わせて下げる
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.5 + 0.5 / sources.length;

    // 定位は左端(-1.0)から右端(+1.0)までに等間隔に配置する
    const space = 2.0 / (sources.length + 1);
    const pannerNodes = sources.map((_, index) => {
      const pannerNode = this.context.createStereoPanner();
      pannerNode.pan.value = -1.0 + space * (index + 1);
      pannerNode.connect(gainNode);
      return pannerNode;
    });

    this.audioBufferSourceNodes = sources.map((source, index) => {
      const pannerNode = pannerNodes[index];
      const audioSource = this.context.createBufferSource();
      audioSource.buffer = source.audioBuffer;
      audioSource.connect(pannerNode);
      return audioSource;
    });

    gainNode.connect(this.context.destination);

    const minStartPosition = Math.min(
      ...sources.map((s) => s.analyzedData.startPosition)
    );

    const offsets = sources.map((s) => {
      const diff = s.analyzedData.startPosition - minStartPosition;
      return offset + diff;
    });

    // Start sync play!
    this.audioBufferSourceNodes.forEach((node, index) => {
      node.start(0, offsets[index]);
    });

    Promise.race(
      this.audioBufferSourceNodes.map((node) => {
        return new Promise((resolve) => {
          node.addEventListener("ended", () => resolve());
        });
      })
    ).then(() => {
      if (this.playing) {
        if (this.intervalId !== null) {
          log("stop internal looper.", this.intervalId);
          clearInterval(this.intervalId as number);
        }
        this.lastCheckedContextTime = null;
        this.intervalId = null;
        this._playing = false;

        log("event - end");
        this.emit("end");
      }
    });
  }

  /**
   * Stop audio source.
   */
  private async stopSyncPlay(): Promise<void> {
    log("try to stop sync-play");

    if (!this.audioBufferSourceNodes) {
      console.error("player has no nodes.");
      return;
    }

    const endPromises = this.audioBufferSourceNodes.map((source) => {
      return new Promise((resolve) => {
        source.addEventListener("ended", () => resolve());
      });
    });

    this.audioBufferSourceNodes.forEach((node) => {
      node.stop(0);
    });

    await Promise.race(endPromises).then(() => {
      log("sync-play is stop");
    });
  }

  private onPlayerUpdated() {
    const currentContextTime = this.context.currentTime;
    if (this.lastCheckedContextTime === null) {
      this.lastCheckedContextTime = currentContextTime;
      return;
    }

    const diff = currentContextTime - this.lastCheckedContextTime;
    this.lastCheckedContextTime = currentContextTime;

    this._currentTime = this._currentTime + diff;

    this.emit("update", { currentTime: this.currentTime });
  }

  private decodeAudioSources(arrayBuffers: ArrayBuffer[]) {
    return Promise.all(
      arrayBuffers.map(async (buffer) => {
        const audioBuffer = await this.context.decodeAudioData(buffer);
        return {
          audioBuffer,
          analyzedData: analyzeBpm(audioBuffer),
        };
      })
    );
  }
}
