import {AnyAction, Dispatch} from "redux";
import {States} from "./redux";
import Audio from "./Audio";

export enum PlayerActionTypes {
  LOAD_LEFT_AUDIO = "c_tune/player/load_left_audio",
  LOAD_RIGHT_AUDIO = "c_tune/player/load_right_audio",
}

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
