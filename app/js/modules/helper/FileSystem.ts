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
