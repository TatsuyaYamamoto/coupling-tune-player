import { readAsArrayBuffer } from "./FileSystem";

/**
 * @fileOverview AudioContext of Web Song API
 * @see https://developer.mozilla.org/ja/docs/Web/API/AudioContext
 */

/**
 * AudioContext class.
 */
// TODO
// const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;

/**
 * AudioContext instance.
 * Should use as singleton.
 */
// TODO
const context = null;

/**
 * Load provided {@code File} as AudioBuffer with AudioContext.
 *
 * @returns {Promise<AudioBuffer>}
 */
async function loadAsAudioBuffer(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await readAsArrayBuffer(file);

  return new Promise<AudioBuffer>((resolve, reject) => {
    context.decodeAudioData(
      arrayBuffer,
      (decodedData) => {
        resolve(decodedData);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export { context, loadAsAudioBuffer };
