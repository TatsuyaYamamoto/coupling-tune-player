import { default as AutoBind } from "autobind-decorator";

export interface AudioConstructor {
  file: File;
  title: string;
  artist: string | null;
  pictureBase64: string | null;
  duration: number;
}

@AutoBind
class Track {
  private _file: File;
  private _title: string;
  private _artist: string | null;
  private _pictureBase64: string | null;
  private _duration: number;

  public constructor(props: AudioConstructor) {
    const { file, title, artist, pictureBase64, duration } = props;

    this._file = file;
    this._title = title;
    this._artist = artist;
    this._pictureBase64 = pictureBase64;
    this._duration = duration;
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

  public get duration(): number {
    return this._duration;
  }
}

export default Track;
