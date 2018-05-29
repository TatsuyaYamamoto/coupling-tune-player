import { EventEmitter, ListenerFn } from "eventemitter3";
import { default as AutoBind } from "autobind-decorator";
import { loadAsAudioBuffer } from "../helper/AudioContext"; // tslint:disable-line:import-name
import { analyzeBpm } from "../helper/BpmAnalyzer";
import { loadTags, Tag } from "../helper/TagLoader";
import { readAsArrayBuffer } from "../helper/FileSystem";

const { read: readTags } = require("jsmediatags/dist/jsmediatags.min.js");

export interface AudioConstructor {
  file: File;
}

export type AudioEvents = "tagloaded" | "hoge";
export type BPM = number;

@AutoBind
class Audio {
  private _eventEmitter = new EventEmitter();
  private _file: File;
  private _tag: Tag | null = null;
  private _bpm: BPM | null = null;
  private _startPosition: number | null = null;
  private _audioBuffer: AudioBuffer | null = null;

  public constructor(props: AudioConstructor) {
    const { file } = props;
    this._file = file;
  }

  public static async load(file: File): Promise<Audio> {
    const audioBuffer = await loadAsAudioBuffer(file);
    const { title, artist, pictureBase64 } = await loadTags(file);
    const { bpm, startPosition } = await analyzeBpm(audioBuffer);

    return new Audio({ file });
  }

  public get file(): File {
    return this._file;
  }

  public get bpm(): number | null {
    return this._bpm;
  }

  public get startPosition(): number | null {
    return this._startPosition;
  }

  /**
   *
   * @returns {Promise<AudioBuffer>}
   */
  public async loadAsAudioBuffer(): Promise<AudioBuffer> {
    if (this._audioBuffer) {
      return this._audioBuffer;
    }

    const arrayBuffer = await readAsArrayBuffer(this.file);
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    this._audioBuffer = audioBuffer;

    return audioBuffer;
  }

  /**
   * BPMを解析する。
   *
   * @returns {Promise<BPM>}
   */
  public async analyzeBpm(): Promise<BPM> {
    if (this._bpm) {
      return this._bpm;
    }
    const audioBuffer = await this.loadAsAudioBuffer();
    const result = await analyzeBpm(audioBuffer);

    console.log("analyzed BPM", result);

    this._bpm = result.bpm;
    this._startPosition = result.startPosition;

    return this._bpm;
  }

  public async getTag(): Promise<Tag> {
    this._tag = await loadTags(this.file);

    return this._tag;
  }

  public on(event: AudioEvents, callback: ListenerFn): this {
    this._eventEmitter.on(event, callback);
    return this;
  }

  public once(event: AudioEvents, callback: ListenerFn): this {
    this._eventEmitter.once(event, callback);
    return this;
  }

  public off(event: AudioEvents, callback: ListenerFn): this {
    this._eventEmitter.off(event, callback);
    return this;
  }
}

export default Audio;
