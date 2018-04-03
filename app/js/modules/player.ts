import {AnyAction, Dispatch} from "redux";
import {States} from "./redux";
import Audio from "./Audio";

export enum PlayerActionTypes {
  LOAD_LEFT_AUDIO = "c_tune/player/load_left_audio",
  LOAD_RIGHT_AUDIO = "c_tune/player/load_right_audio",
  PLAY = "c_tune/player/play",
  PAUSE = "c_tune/player/pause",
}

// TODO Check supporting WebAudioAPI
const audioContext = new AudioContext();
// TODO Don't recreate on start audio.
let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;

export function load(file: File, type: "left" | "right") {
  return (dispatch: Dispatch<States>) => {
    // TODO: Check audio file.

    const audio = Audio.load(file);
    audio.loadTags()
      .then(() => {
        dispatch({
          type: type === "left" ?
            PlayerActionTypes.LOAD_LEFT_AUDIO :
            PlayerActionTypes.LOAD_RIGHT_AUDIO,
          payload: {
            audio,
          },
        });
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
}

export function play() {
  return (dispatch: Dispatch<States>, getState: () => States) => {
    const {leftAudio, rightAudio, lastAudioPosition} = getState().player;

    if (!leftAudio || !rightAudio) {
      console.error("Right or Left audio source is not selected.");
      return;
    }

    Promise
      .all([
        readAsArrayBuffer(leftAudio.file),
        readAsArrayBuffer(rightAudio.file),
      ])
      .then((arrayBufferList) => Promise.all(
        arrayBufferList.map((buffer) => audioContext.decodeAudioData(buffer)),
      ))
      .then(([leftAudioBuffer, rightAudioBuffer]) => {
        leftAudioSource = audioContext.createBufferSource();
        rightAudioSource = audioContext.createBufferSource();

        leftAudioSource.buffer = leftAudioBuffer;
        rightAudioSource.buffer = rightAudioBuffer;

        leftAudioSource.connect(audioContext.destination);
        rightAudioSource.connect(audioContext.destination);
        leftAudioSource.start(lastAudioPosition);
        rightAudioSource.start(lastAudioPosition);

        dispatch({
          type: PlayerActionTypes.PLAY,
        });
      });
  };
}

export function pause() {
  return (dispatch: Dispatch<States>, getState: () => States) => {
    const {playing} = getState().player;
    if (!playing) {

      console.error("Player is not running.");
      return;
    }
    if (leftAudioSource !== null) {
      leftAudioSource.stop(0);
    }
    leftAudioSource = null;

    if (rightAudioSource !== null) {
      rightAudioSource.stop(0);
    }
    rightAudioSource = null;

    dispatch({
      type: PlayerActionTypes.PAUSE,
      payload: {
        lastAudioPosition: audioContext.currentTime,
      },
    });
  };
}

// TODO: move helper class
function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

export interface PlayerState {
  playing: boolean;
  lastAudioPosition: number;
  leftAudio: Audio | null;
  rightAudio: Audio | null;
}

const initialState: PlayerState = {
  playing: false,
  lastAudioPosition: 0,
  leftAudio: null,
  rightAudio: null,
};

export default function reducer(state: PlayerState = initialState, action: AnyAction): PlayerState {
  const {type, payload} = action;

  switch (type) {
    case PlayerActionTypes.LOAD_LEFT_AUDIO:
      return Object.assign({}, state, {
        leftAudio: payload.audio,
        lastAudioPosition: 0,
      });

    case PlayerActionTypes.LOAD_RIGHT_AUDIO:
      return Object.assign({}, state, {
        rightAudio: payload.audio,
        lastAudioPosition: 0,
      });

    case PlayerActionTypes.PLAY:
      return Object.assign({}, state, {
        playing: true,
      });

    case PlayerActionTypes.PAUSE:
      return Object.assign({}, state, {
        playing: false,
        lastAudioPosition: payload.lastAudioPosition,
      });

    default:
      return state;
  }
}
