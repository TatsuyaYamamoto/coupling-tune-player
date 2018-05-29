import { context } from "./AudioContext";
import Audio from "../model/Audio";

let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;

/**
 * Play audio file synchronously.
 *
 * @param {Audio} left
 * @param {Audio} right
 * @param {number} offset
 */
export function syncPlay(left: Audio, right: Audio, offset: number = 0) {
  leftAudioSource = context.createBufferSource();
  leftAudioSource.buffer = left.audioBuffer;

  rightAudioSource = context.createBufferSource();
  rightAudioSource.buffer = right.audioBuffer;

  // TODO: Check to arrange gain is required?
  const gainNode = context.createGain();
  gainNode.gain.value = 0.8;

  leftAudioSource.connect(gainNode);
  rightAudioSource.connect(gainNode);

  gainNode.connect(context.destination);
  let leftAudioOffset = offset;
  let rightAudioOffset = offset;
  const diff = left.startPosition - right.startPosition;

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
