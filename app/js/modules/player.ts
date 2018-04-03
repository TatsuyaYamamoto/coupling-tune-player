import {AnyAction, Dispatch} from "redux";
import {States} from "./redux";
import Audio from "./Audio";

export enum PlayerActionTypes {
  LOAD_LEFT_AUDIO = "c_tune/player/load_left_audio",
  LOAD_RIGHT_AUDIO = "c_tune/player/load_right_audio",
}

// TODO Check supporting WebAudioAPI
const audioContext = new AudioContext();

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
    const {leftAudio, rightAudio} = getState().player;

    if (!leftAudio || !rightAudio) {
      console.error("Right or Left audio source is not selected.");
      return;
    }

    const leftAudioSource = audioContext.createBufferSource();
    const rightAudioSource = audioContext.createBufferSource();

    Promise
      .all([
        readAsArrayBuffer(leftAudio.file),
        readAsArrayBuffer(rightAudio.file),
      ])
      .then((arrayBufferList) => Promise.all(
        arrayBufferList.map((buffer) => audioContext.decodeAudioData(buffer)),
      ))
      .then(([leftAudioBuffer, rightAudioBuffer]) => {
        leftAudioSource.buffer = leftAudioBuffer;
        rightAudioSource.buffer = rightAudioBuffer;

        leftAudioSource.connect(audioContext.destination);
        rightAudioSource.connect(audioContext.destination);
        leftAudioSource.start(0);
        rightAudioSource.start(0);
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
  leftAudio: Audio | null;
  rightAudio: Audio | null;
}

const initialState: PlayerState = {
  leftAudio: null,
  rightAudio: null,
};

export default function reducer(state: PlayerState = initialState, action: AnyAction): PlayerState {
  const {type, payload} = action;

  switch (type) {
    case PlayerActionTypes.LOAD_LEFT_AUDIO:
      return Object.assign({}, state, {
        leftAudio: payload.audio,
      });

    case PlayerActionTypes.LOAD_RIGHT_AUDIO:
      return Object.assign({}, state, {
        rightAudio: payload.audio,
      });

    default:
      return state;
  }
}
