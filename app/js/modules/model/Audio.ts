import { EventEmitter, ListenerFn } from "eventemitter3";
import { default as AutoBind } from "autobind-decorator";

export interface AudioConstructor {
  file: File;
  title: string;
  artist: string | null;
  pictureBase64: string | null;
  bpm: BPM;
  startPosition: number;
  audioBuffer: AudioBuffer;
}

export type AudioEvents = "tagloaded" | "hoge";
export type BPM = number;

@AutoBind
class Audio {
  private _eventEmitter = new EventEmitter();
  private _file: File;
  private _title: string;
  private _artist: string | null;
  private _pictureBase64: string | null;
  private _bpm: BPM;
  private _startPosition: number;
  private _audioBuffer: AudioBuffer;

  public constructor(props: AudioConstructor) {
    const {
      file,
      title,
      artist,
      pictureBase64,
      bpm,
      startPosition,
      audioBuffer
    } = props;

    this._file = file;
    this._title = title;
    this._artist = artist;
    this._pictureBase64 = pictureBase64;
    this._bpm = bpm;
    this._startPosition = startPosition;
    this._audioBuffer = audioBuffer;
  }

  public get file(): File {
    return this._file;
  }

  public get title(): string {
    return this._title;
  }

  public get artist(): string | null {
    return this._artist;
  }

  public get pictureBase64(): string | null {
    return this._pictureBase64;
  }

  public get bpm(): number {
    return this._bpm;
  }

  public get startPosition(): number {
    return this._startPosition;
  }

  public get audioBuffer(): AudioBuffer {
    return this._audioBuffer;
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
