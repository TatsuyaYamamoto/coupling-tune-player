import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { States } from "../store";

import { context, loadAsAudioBuffer } from "../../helper/AudioContext";

import Song from "../model/Song";

import Timer = NodeJS.Timer;
import { syncPlay, stop as syncStop } from "../../helper/SyncPlayer";
import { goNextIndex, goPrevIndex } from "./tracklist";
import { analyzeBpm } from "../../helper/BpmAnalyzer";

export enum PlayerActionTypes {
  PLAY_REQUEST = "c_tune/player/play_request",
  PLAY_SUCCESS = "c_tune/player/play_success",
  PAUSE = "c_tune/player/pause",
  UPDATE_CURRENT = "c_tune/player/update_current"
}

type ThunkResult<R> = ThunkAction<R, States, undefined, AnyAction>;

let lastCheckTime: number | null = null;
let intervalId: Timer | number | null = null;

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

    const [left, right] = await Promise.all([
      analyze(leftAudio.file, "left"),
      analyze(rightAudio.file, "right")
    ]);

    const { currentTime } = getState().player;
    syncPlay(
      left.audioBuffer,
      left.startPosition,
      right.audioBuffer,
      right.startPosition,
      currentTime
    ).then(() => {
      lastCheckTime = null;
      if (intervalId !== null) {
        clearInterval(intervalId as number);
      }
      intervalId = null;

      const { player, tracklist } = getState();

      if (player.playing && tracklist.nextIndex !== null) {
        dispatch(skipNext());
      }
    });

    dispatch({
      type: PlayerActionTypes.PLAY_SUCCESS,
      payload: {
        duration: left.audioBuffer.duration
      }
    });

    intervalId = setInterval(() => {
      dispatch(updateCurrentTime());
    }, 500);
  };
};

/**
 *
 * @param {File} file
 * @param {"left" | "right"} type
 * @returns {Promise<{audioBuffer: AudioBuffer; startPosition: number}>}
 */
async function analyze(file: File, type: "left" | "right") {
  const audioBuffer = await loadAsAudioBuffer(file);
  console.log(
    `Loaded as audio buffer. type: ${type}, length: ${audioBuffer.length}`
  );

  const { bpm, startPosition } = analyzeBpm(audioBuffer);
  console.log(`Analyzed. type: ${type}, BPM: ${bpm}`);

  return { audioBuffer, startPosition };
}

/**
 * 音声の再生を停止する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export const pause = (): ThunkResult<void> => {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const { playing } = getState().player;

    if (!playing) {
      console.error("Player is not running.");
      return;
    }

    syncStop();

    dispatch({
      type: PlayerActionTypes.PAUSE
    });
  };
};

/**
 * 現在の再生時間を更新する
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export const updateCurrentTime = (time?: number): ThunkResult<void> => {
  return async (dispatch, getState) => {
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
  currentTime: 0
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
        loading: true
      };

    case PlayerActionTypes.PLAY_SUCCESS:
      return {
        ...state,
        loading: false,
        playing: true,
        duration: payload.duration
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
