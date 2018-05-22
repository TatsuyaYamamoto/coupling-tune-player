import { EventEmitter, ListenerFn } from "eventemitter3";
import AutoBind from "autobind-decorator";

const { read: readTags } = require("jsmediatags/dist/jsmediatags.min.js");

export interface AudioConstructor {
  file: File;
}

export type AudioEvents = "tagloaded" | "hoge";

@AutoBind
class Audio {
  private _eventEmitter = new EventEmitter();
  private _file: File;
  private _title: string | null = null;
  private _artist: string | null = null;
  private _pictureBase64: string | null = null;

  public constructor(props: AudioConstructor) {
    const { file } = props;
    this._file = file;
  }

  public static load(file: File): Audio {
    return new Audio({ file });
  }

  public get file(): File {
    return this._file;
  }

  public get title(): string | null {
    return this._title;
  }

  public get artist(): string | null {
    return this._artist;
  }

  public get pictureBase64(): string | null {
    return this._pictureBase64;
  }

  public on(event: AudioEvents, callback: ListenerFn) {
    this._eventEmitter.on(event, callback);
  }

  public once(event: AudioEvents, callback: ListenerFn) {
    this._eventEmitter.once(event, callback);
  }

  public off(event: AudioEvents, callback: ListenerFn) {
    this._eventEmitter.off(event, callback);
  }

  public loadTags(): Promise<void> {
    return new Promise((resolve, reject) => {
      readTags(this._file, {
        onSuccess: ({ tags }: any) => {
          // TODO define type
          this.onLoadTagsSucceed(tags);
          resolve();
        },
        onError: reject
      });
    });
  }

  private onLoadTagsSucceed(tags: any) {
    const { title, artist, picture } = tags;

    this._title = title;
    this._artist = artist;

    if (picture && picture.data && picture.format) {
      const base64String = Array.from<number>(picture.data)
        .map(code => String.fromCharCode(code))
        .join("");

      this._pictureBase64 = `data:${picture.format};base64,${window.btoa(
        base64String
      )}`;
    }

    this._eventEmitter.emit("tagloaded");
  }
}

export default Audio;
