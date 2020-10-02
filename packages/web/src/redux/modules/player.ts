import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { CouplingPlayer } from "@coupling-tune-player/share";

import { States } from "../store";

import Song from "../model/Song";

import { goNextIndex, goPrevIndex } from "./tracklist";

export enum PlayerActionTypes {
  PLAY_REQUEST = "c_tune/player/play_request",
  PLAY_SUCCESS = "c_tune/player/play_success",
  PAUSE = "c_tune/player/pause",
  UPDATE_CURRENT = "c_tune/player/update_current",
}

type ThunkResult<R> = ThunkAction<R, States, undefined, AnyAction>;

let couplingPlayer: CouplingPlayer | null = null;
let playingTitle: string | null = null;

/**
 * 音声の再生を開始する。
 *
 * @param {Song} leftAudio
 * @param {Song} rightAudio
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => Promise<void>}
 */
export const play = (leftAudio: Song, rightAudio: Song): ThunkResult<void> => {
  return async (dispatch, getState) => {
    dispatch({ type: PlayerActionTypes.PLAY_REQUEST });

    if (playingTitle !== leftAudio.title) {
      if (couplingPlayer) {
        couplingPlayer.off("play");
        couplingPlayer.off("pause");
        couplingPlayer.off("update");
      }

      couplingPlayer = new CouplingPlayer(
        await Promise.all([
          leftAudio.file.arrayBuffer(),
          rightAudio.file.arrayBuffer(),
        ])
      );
      couplingPlayer.on("play", () => {
        dispatch({
          type: PlayerActionTypes.PLAY_SUCCESS,
          payload: {
            duration: couplingPlayer.duration,
          },
        });
      });
      couplingPlayer.on("pause", (args: any) => {
        dispatch({
          type: PlayerActionTypes.PAUSE,
        });
      });
      couplingPlayer.on("update", (args: any) => {
        dispatch({
          type: PlayerActionTypes.UPDATE_CURRENT,
          payload: { currentTime: args.currentTime },
        });
      });
    }

    await couplingPlayer.play();

    playingTitle = leftAudio.title;
    couplingPlayer.currentTime = getState().player.currentTime;
  };
};

/**
 * 音声の再生を停止する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export const pause = (): ThunkResult<void> => {
  return async () => {
    if (!couplingPlayer) {
      console.error("coupling-player is not initialized.");
      return;
    }

    couplingPlayer.pause();
  };
};

/**
 * 現在の再生時間を更新する
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export const updateCurrentTime = (time?: number): ThunkResult<void> => {
  return async () => {
    if (!couplingPlayer) {
      console.error("coupling-player is not initialized.");
      return;
    }

    couplingPlayer.currentTime = time;
  };
};

export const skipPrevious = (): ThunkResult<void> => (dispatch, getState) => {
  const stopOnce = getState().player.playing;
  if (stopOnce) {
    dispatch(pause());
  }

  dispatch(updateCurrentTime(0));
  dispatch(goPrevIndex());

  if (stopOnce) {
    const { list, focusIndex } = getState().tracklist;

    if (!focusIndex) {
      console.error("index is null");
      return;
    }
    const { left, right } = list.get(focusIndex);

    if (!left || !right) {
      console.error("left or right audio is null");
      return;
    }

    dispatch(play(left, right));
  }
};

export const skipNext = (): ThunkResult<void> => (dispatch, getState) => {
  const stopOnce = getState().player.playing;
  if (stopOnce) {
    dispatch(pause());
  }

  dispatch(updateCurrentTime(0));
  dispatch(goNextIndex());

  if (stopOnce) {
    const { list, focusIndex } = getState().tracklist;

    if (!focusIndex) {
      console.error("index is null");
      return;
    }
    const { left, right } = list.get(focusIndex);

    if (!left || !right) {
      console.error("left or right audio is null");
      return;
    }

    dispatch(play(left, right));
  }
};

export interface PlayerState {
  loading: boolean;
  playing: boolean;
  duration: number;
  currentTime: number;
}

const initialState: PlayerState = {
  loading: false,
  playing: false,
  duration: 0,
  currentTime: 0,
};

export default function reducer(
  state: PlayerState = initialState,
  action: AnyAction
): PlayerState {
  const { type, payload } = action;

  switch (type) {
    case PlayerActionTypes.PLAY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case PlayerActionTypes.PLAY_SUCCESS:
      return {
        ...state,
        loading: false,
        playing: true,
        duration: payload.duration,
      };

    case PlayerActionTypes.PAUSE:
      return {
        ...state,
        playing: false,
      };

    case PlayerActionTypes.UPDATE_CURRENT:
      return {
        ...state,
        currentTime: payload.currentTime,
      };

    default:
      return state;
  }
}
