const {read: readTags} = require("jsmediatags/dist/jsmediatags.min.js");

export interface Tag {
  title: string | null;
  artist: string | null;
  pictureBase64: string | null;
}

export function loadTags(file: File): Promise<Tag> {
  return new Promise(((resolve, reject) => {
    readTags(file, {
      onSuccess: ({tags}: any) => { // TODO define type
        resolve(parseTags(tags));
      },
      onError: reject,
    });
  }));
}

function parseTags(tags: any): Tag {
  const {
    title,
    artist,
    picture,
  } = tags;

  let pictureBase64 = null;
  if (picture && picture.data && picture.format) {
    const base64String = Array
      .from<number>(picture.data)
      .map((code) => String.fromCharCode(code))
      .join("");

    pictureBase64 = `data:${picture.format};base64,${window.btoa(base64String)}`;
  }

  return {
    title,
    artist,
    pictureBase64,
  };
}
