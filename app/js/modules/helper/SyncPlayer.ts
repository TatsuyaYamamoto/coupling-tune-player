import { context } from "./AudioContext";
import Audio from "../model/Audio";

let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;

/**
 * Play audio file synchronously.
 *
 * @param {AudioBuffer} leftAudioBuffer
 * @param {number} leftStartPosition
 * @param {AudioBuffer} rightAudioBuffer
 * @param {number} rightStartPosition
 * @param {number} offset
 */
export function syncPlay(
  leftAudioBuffer: AudioBuffer,
  leftStartPosition: number,
  rightAudioBuffer: AudioBuffer,
  rightStartPosition: number,
  offset: number = 0
) {
  leftAudioSource = context.createBufferSource();
  leftAudioSource.buffer = leftAudioBuffer;

  rightAudioSource = context.createBufferSource();
  rightAudioSource.buffer = rightAudioBuffer;

  // TODO: Check to arrange gain is required?
  const gainNode = context.createGain();
  gainNode.gain.value = 0.8;

  leftAudioSource.connect(gainNode);
  rightAudioSource.connect(gainNode);

  gainNode.connect(context.destination);
  let leftAudioOffset = offset;
  let rightAudioOffset = offset;
  const diff = leftStartPosition - rightStartPosition;

  if (0 < diff) {
    leftAudioOffset += diff;
  } else {
    rightAudioOffset += -1 * diff;
  }

  leftAudioSource.start(0, leftAudioOffset);
  rightAudioSource.start(0, rightAudioOffset);
}

/**
 * Stop audio source.
 */
export function pause() {
  if (leftAudioSource !== null) {
    leftAudioSource.stop(0);
    leftAudioSource = null;
  }

  if (rightAudioSource !== null) {
    rightAudioSource.stop(0);
    rightAudioSource = null;
  }
}
