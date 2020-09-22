/**
 * @fileOverview AudioContext of Web Song API
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
export const context: AudioContext = new AudioContext();
