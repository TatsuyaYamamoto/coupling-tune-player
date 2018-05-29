import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";

import { context, loadAsAudioBuffer } from "./helper/AudioContext";
import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";

import Audio from "./model/Audio";

import Timer = NodeJS.Timer;
import { syncPlay, pause as syncPause } from "./helper/SyncPlayer";

export enum PlayerActionTypes {
  LOAD_REQUEST = "c_tune/player/load_request",
  LOAD_SUCCESS = "c_tune/player/load_success",
  LOAD_BUFFER_SUCCESS = "c_tune/player/load_buffer_success",
  LOAD_TAG_SUCCESS = "c_tune/player/load_tag_success",
  ANALYZE_BPM_SUCCESS = "c_tune/player/analyze_bpm_success",
  PLAY = "c_tune/player/play",
  PAUSE = "c_tune/player/pause",
  UPDATE_CURRENT = "c_tune/player/update_current"
}

let lastCheckTime: number | null = null;
let intervalId: Timer | number | null = null;

/**
 * 音声ファイルをロードする
 *
 * @param {File} file
 * @param {"left" | "right"} type
 * @returns {(dispatch: Dispatch<States>) => Promise<void>}
 */
export function load(file: File, type: "left" | "right") {
  return async (dispatch: Dispatch<States>) => {
    // TODO: Check audio file.
    dispatch({ type: PlayerActionTypes.LOAD_REQUEST });

    const audioBuffer = await loadAsAudioBuffer(file);
    console.log("Loaded audio buffer. length: " + audioBuffer.length);

    const { title, artist, pictureBase64 } = await loadTags(file);
    console.log("Loaded media tag.", title, artist);

    const { bpm, startPosition } = await analyzeBpm(audioBuffer);
    console.log("Analyzed BPM.", bpm);

    const audio = new Audio({
      file,
      artist,
      pictureBase64,
      bpm,
      startPosition,
      audioBuffer,
      title: title || file.name
    });

    dispatch({
      type: PlayerActionTypes.LOAD_SUCCESS,
      payload: {
        type,
        audio
      }
    });
  };
}

/**
 * 音声の再生を開始する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => Promise<void>}
 */
export function play() {
  return async (dispatch: Dispatch<States>, getState: () => States) => {
    const { left, right, currentTime } = getState().player;

    if (!left || !right) {
      console.error("No audio buffer of right or left.");
      return;
    }

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

    if (time) {
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

export interface PlayerState {
  loading: boolean;
  playing: boolean;
  durationTime: number;
  currentTime: number;
  left: Audio | null;
  right: Audio | null;
}

const initialState: PlayerState = {
  loading: false,
  playing: false,
  durationTime: 0,
  currentTime: 0,
  left: null,
  right: null
};

export default function reducer(
  state: PlayerState = initialState,
  action: AnyAction
): PlayerState {
  const { type, payload } = action;

  switch (type) {
    case PlayerActionTypes.LOAD_REQUEST:
      return {
        ...state,
        loading: true
      };

    case PlayerActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        [payload.type]: payload.audio
      };

    case PlayerActionTypes.LOAD_BUFFER_SUCCESS:
      return {
        ...state,
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            buffer: payload.audioBuffer
          }
        )
      };

    case PlayerActionTypes.ANALYZE_BPM_SUCCESS:
      return {
        ...state,
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            bpm: payload.bpm,
            startPositionMillis: payload.startPositionMillis
          }
        )
      };

    case PlayerActionTypes.LOAD_TAG_SUCCESS:
      return {
        ...state,
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            title: payload.title,
            artist: payload.artist,
            pictureBase64: payload.pictureBase64
          }
        )
      };

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
