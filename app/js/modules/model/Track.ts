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
class Track {
  private _eventEmitter = new EventEmitter();
  private _file: File;
  private _title: string;
  private _artist: string | null;
  private _pictureBase64: string | null;

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

export default Track;
