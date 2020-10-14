export interface SongConstructor {
  file: File;
  title: string;
  artist: string | null;
  pictureBase64: string | null;
}

class Song {
  private _file: File;
  private _title: string;
  private _artist: string | null;
  private _pictureBase64: string | null;

  public constructor(props: SongConstructor) {
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
}

export default Song;
