import { readAsArrayBuffer } from "./FileSystem";

/**
 * @fileOverview AudioContext of Web Track API
 * @see https://developer.mozilla.org/ja/docs/Web/API/AudioContext
 */

/**
 * AudioContext class.
 */
const AudioContext =
  (window as any).AudioContext || (window as any).webkitAudioContext;

/**
 * AudioContext instance.
 * Should use as singleton.
 */
const context: AudioContext = new AudioContext();

/**
 *
 * @returns {Promise<AudioBuffer>}
 */
async function loadAsAudioBuffer(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await readAsArrayBuffer(file);
  return await context.decodeAudioData(arrayBuffer);
}

export { context, loadAsAudioBuffer };
