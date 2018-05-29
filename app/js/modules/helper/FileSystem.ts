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
