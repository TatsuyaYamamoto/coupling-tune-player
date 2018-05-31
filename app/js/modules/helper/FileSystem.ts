/**
 * Return promise will resolve on load as array buffer.
 *
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();

  const p = new Promise<ArrayBuffer>(resolve => {
    reader.onload = () => resolve(reader.result);
  });

  reader.readAsArrayBuffer(file);

  return p;
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      resolve(<string>reader.result);
    };
  });
}

export function loadAsAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise(resolve => {
    const audio = new Audio();
    audio.addEventListener("loadedmetadata", (a: any) => {
      resolve(audio);
    });
    audio.src = src;
  });
}

/**
 * Convert {@code FileList} to Array of {@code File}.
 *
 * @param {FileList} fileList
 * @returns {File[]}
 */
export function toFiles(fileList: FileList): File[] {
  return <File[]>[...Array(fileList.length)]
    .fill(0)
    .map((_, i) => fileList.item(i));
}
