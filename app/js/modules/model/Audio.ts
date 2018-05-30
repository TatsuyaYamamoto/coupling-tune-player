import { EventEmitter, ListenerFn } from "eventemitter3";
import { default as AutoBind } from "autobind-decorator";

export interface AudioConstructor {
  file: File;
  title: string;
  artist: string | null;
  pictureBase64: string | null;
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
  private _bpm: BPM | null = null;
  private _startPosition: number | null = null;
  private _audioBuffer: AudioBuffer | null = null;

  public constructor(props: AudioConstructor) {
    const { file, title, artist, pictureBase64 } = props;

    this._file = file;
    this._title = title;
    this._artist = artist;
    this._pictureBase64 = pictureBase64;
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

  public get bpm(): BPM {
    if (!this._bpm) {
      throw new Error("Could not access. BPM is not ready.");
    }

    return this._bpm;
  }

  public get startPosition(): number {
    if (!this._startPosition) {
      throw new Error("Could not access. startPosition is not ready.");
    }

    return this._startPosition;
  }

  public get audioBuffer(): AudioBuffer {
    if (!this._audioBuffer) {
      throw new Error("Could not access. audioBuffer is not ready.");
    }

    return this._audioBuffer;
  }

  public set bpm(bpm: BPM) {
    this._bpm = bpm;
  }

  public set startPosition(startPosition: number) {
    this._startPosition = startPosition;
  }

  public set audioBuffer(audioBuffer: AudioBuffer) {
    this._audioBuffer = audioBuffer;
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
