const { read: readTags } = require("jsmediatags/dist/jsmediatags.min.js");

export interface TagConstructor {
  title: string | null;
  artist: string | null;
  pictureBase64: string | null;
}

class Tag {
  private _title: string | null;
  private _artist: string | null;
  private _pictureBase64: string | null;

  public constructor(params: TagConstructor) {
    const { title, artist, pictureBase64 } = params;

    this._title = title;
    this._artist = artist;
    this._pictureBase64 = pictureBase64;
  }

  public get title() {
    return this._title;
  }

  public get artist() {
    return this._artist;
  }

  public get pictureBase64() {
    return this._pictureBase64;
  }

  public static load(file: File): Promise<Tag> {
    return new Promise((resolve, reject) => {
      readTags(file, {
        onSuccess: ({ tags }: any) => {
          // TODO define type
          resolve(Tag.parse(tags));
        },
        onError: reject
      });
    });
  }

  public static parse(tags: any): Tag {
    const { title, artist, picture } = tags;

    let pictureBase64 = null;
    if (picture && picture.data && picture.format) {
      const base64String = Array.from<number>(picture.data)
        .map(code => String.fromCharCode(code))
        .join("");

      pictureBase64 = `data:${picture.format};base64,${window.btoa(
        base64String
      )}`;
    }

    return new Tag({
      title,
      artist,
      pictureBase64
    });
  }
}

export default Tag;
