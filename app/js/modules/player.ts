import {AnyAction, Dispatch} from "redux";
import {States} from "./redux";

import Audio from "./helper/Audio";
import SyncPlayer from "./helper/SyncPlayer";

export enum PlayerActionTypes {
  LOAD_LEFT_AUDIO = "c_tune/player/load_left_audio",
  LOAD_RIGHT_AUDIO = "c_tune/player/load_right_audio",
  PLAY = "c_tune/player/play",
  PAUSE = "c_tune/player/pause",
}

let syncPlayer: SyncPlayer | null = null;

export function load(file: File, type: "left" | "right") {
  return (dispatch: Dispatch<States>, getState: () => States) => {
    // TODO: Check audio file.

    const audio = Audio.load(file);
    audio.loadTags()
      .catch((error: any) => console.error(error))
      .then(() => {
        dispatch({
          type: type === "left" ?
            PlayerActionTypes.LOAD_LEFT_AUDIO :
            PlayerActionTypes.LOAD_RIGHT_AUDIO,
          payload: {
            audio,
          },
        });
        const {leftAudio, rightAudio} = getState().player;
        if (type === "left" && rightAudio) {
          syncPlayer = new SyncPlayer({
            left: audio,
            right: rightAudio,
          });

          syncPlayer.load();
        }
        if (type === "right" && leftAudio) {
          syncPlayer = new SyncPlayer({
            left: leftAudio,
            right: audio,
          });

          syncPlayer.load();
        }
      });
  };
}

export function play() {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const {leftAudio, rightAudio} = getState().player;

    if (!leftAudio || !rightAudio) {
      console.error("Right or Left audio source is not selected.");
      return;
    }

    if (syncPlayer === null) {
      console.error("SyncPlayer is not ready.");
      return;
    }

    syncPlayer.play();

    dispatch({
      type: PlayerActionTypes.PLAY,
    });
  };
}

export function pause() {
  return (dispatch: Dispatch<States>) => {
    if (syncPlayer === null) {
      console.error("SyncPlayer is not ready.");
      return;
    }

    if (!syncPlayer.playing) {
      console.error("Player is not running.");
      return;
    }

    syncPlayer.pause();

    dispatch({
      type: PlayerActionTypes.PAUSE,
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
  leftAudio: Audio | null;
  rightAudio: Audio | null;
}

const initialState: PlayerState = {
  playing: false,
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

    case PlayerActionTypes.PLAY:
      return Object.assign({}, state, {
        playing: true,
      });

    case PlayerActionTypes.PAUSE:
      return Object.assign({}, state, {
        playing: false,
      });

    default:
      return state;
  }
}
