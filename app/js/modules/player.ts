import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { States } from "./redux";

import { context } from "./helper/AudioContext";

import Audio from "./model/Audio";

import Timer = NodeJS.Timer;
import { syncPlay, pause as syncPause } from "./helper/SyncPlayer";
import { goNextIndex, goPrevIndex } from "./audiolist";

export enum PlayerActionTypes {
  PLAY = "c_tune/player/play",
  PAUSE = "c_tune/player/pause",
  UPDATE_CURRENT = "c_tune/player/update_current"
}

let lastCheckTime: number | null = null;
let intervalId: Timer | number | null = null;

/**
 * 音声の再生を開始する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => Promise<void>}
 */
export function play(left: Audio, right: Audio) {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const { currentTime } = getState().player;

    syncPlay(left, right, currentTime);

    dispatch({
      type: PlayerActionTypes.PLAY
    });

    intervalId = setInterval(() => {
      dispatch(updateCurrentTime());
    }, 500);
  };
}

/**
 * 音声の再生を停止する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export function pause() {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const { playing } = getState().player;

    if (!playing) {
      console.error("Player is not running.");
      return;
    }

    syncPause();

    lastCheckTime = null;
    if (intervalId !== null) {
      clearInterval(intervalId as number);
    }
    intervalId = null;

    dispatch({
      type: PlayerActionTypes.PAUSE
    });
  };
}

/**
 * 現在の再生時間を更新する
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export function updateCurrentTime(time?: number) {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const { currentTime } = getState().player;

    if (typeof time !== "undefined") {
      dispatch({
        type: PlayerActionTypes.UPDATE_CURRENT,
        payload: { currentTime: time }
      });
      return;
    }

    const now = context.currentTime;
    if (lastCheckTime == null) {
      lastCheckTime = now;
      return;
    }

    const add = now - lastCheckTime;
    lastCheckTime = now;

    dispatch({
      type: PlayerActionTypes.UPDATE_CURRENT,
      payload: {
        currentTime: currentTime + add
      }
    });
  };
}

export const skipPrevious = (): ThunkAction<void, States, undefined> => (
  dispatch,
  getState
) => {
  const stopOnce = getState().player.playing;
  if (stopOnce) {
    dispatch(pause());
  }

  dispatch(updateCurrentTime(0));
  dispatch(goPrevIndex());

  if (stopOnce) {
    const { list, playingIndex } = getState().audiolist;

    if (!playingIndex) {
      console.error("index is null");
      return;
    }
    const { left, right } = list[playingIndex];

    if (!left || !right) {
      console.error("left or right audio is null");
      return;
    }

    dispatch(play(left, right));
  }
};

export const skipNext = (): ThunkAction<void, States, undefined> => (
  dispatch,
  getState
) => {
  const stopOnce = getState().player.playing;
  if (stopOnce) {
    dispatch(pause());
  }

  dispatch(updateCurrentTime(0));
  dispatch(goNextIndex());

  if (stopOnce) {
    const { list, playingIndex } = getState().audiolist;

    if (!playingIndex) {
      console.error("index is null");
      return;
    }
    const { left, right } = list[playingIndex];

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
  durationTime: number;
  currentTime: number;
}

const initialState: PlayerState = {
  loading: false,
  playing: false,
  durationTime: 0,
  currentTime: 0
};

export default function reducer(
  state: PlayerState = initialState,
  action: AnyAction
): PlayerState {
  const { type, payload } = action;

  switch (type) {
    case PlayerActionTypes.PLAY:
      return {
        ...state,
        playing: true
      };

    case PlayerActionTypes.PAUSE:
      return {
        ...state,
        playing: false
      };

    case PlayerActionTypes.UPDATE_CURRENT:
      return {
        ...state,
        currentTime: payload.currentTime
      };

    default:
      return state;
  }
}
