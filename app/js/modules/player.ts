import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";

import { context } from "./helper/AudioContext";

import Audio from "./model/Audio";

import Timer = NodeJS.Timer;

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

let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;
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

    const audio = new Audio({ file });
    const audioBuffer = await audio.loadAsAudioBuffer();

    dispatch({
      type: PlayerActionTypes.LOAD_BUFFER_SUCCESS,
      payload: { type, audioBuffer }
    });

    const tag = await audio.getTag();
    const title = !!(tag && tag.title) ? tag.title : file.name;
    const artist = !!(tag && tag.artist) ? tag.artist : null;
    const pictureBase64 = !!(tag && tag.pictureBase64)
      ? tag.pictureBase64
      : null;

    dispatch({
      type: PlayerActionTypes.LOAD_TAG_SUCCESS,
      payload: {
        type,
        title,
        artist,
        pictureBase64
      }
    });

    await audio.analyzeBpm();
    const bpm = audio.bpm;
    const startPositionMillis = (audio.startPosition || 0) * 1000;

    dispatch({
      type: PlayerActionTypes.ANALYZE_BPM_SUCCESS,
      payload: {
        type,
        bpm,
        startPositionMillis
      }
    });

    dispatch({ type: PlayerActionTypes.LOAD_SUCCESS });
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

    if (!left.startPosition || !right.startPosition) {
      console.error("No audio start position of right or left.");
      return;
    }

    leftAudioSource = context.createBufferSource();
    leftAudioSource.buffer = left.buffer;

    rightAudioSource = context.createBufferSource();
    rightAudioSource.buffer = right.buffer;

    // TODO: Check to arrange gain is requiredz?
    const gainNode = context.createGain();
    gainNode.gain.value = 0.8;

    leftAudioSource.connect(gainNode);
    rightAudioSource.connect(gainNode);

    gainNode.connect(context.destination);
    let leftAudioOffset = currentTime;
    let rightAudioOffset = currentTime;
    const diff = left.startPosition - right.startPosition;

    if (0 < diff) {
      leftAudioOffset += diff;
    } else {
      rightAudioOffset += -1 * diff;
    }

    leftAudioSource.start(0, leftAudioOffset);
    rightAudioSource.start(0, rightAudioOffset);

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

    if (leftAudioSource !== null) {
      leftAudioSource.stop(0);
    }

    if (rightAudioSource !== null) {
      rightAudioSource.stop(0);
    }

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
        payload: { currentMillis: time }
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
        currentMillis: currentTime + add
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
      return Object.assign({}, state, {
        loading: true
      });

    case PlayerActionTypes.LOAD_SUCCESS:
      return Object.assign({}, state, {
        loading: false
      });

    case PlayerActionTypes.LOAD_BUFFER_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            buffer: payload.audioBuffer
          }
        )
      });

    case PlayerActionTypes.ANALYZE_BPM_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            bpm: payload.bpm,
            startPositionMillis: payload.startPositionMillis
          }
        )
      });

    case PlayerActionTypes.LOAD_TAG_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign(
          {},
          payload.type === "right" ? state.right : state.left,
          {
            title: payload.title,
            artist: payload.artist,
            pictureBase64: payload.pictureBase64
          }
        )
      });

    case PlayerActionTypes.PLAY:
      return Object.assign({}, state, {
        playing: true
      });

    case PlayerActionTypes.PAUSE:
      return Object.assign({}, state, {
        playing: false
      });

    case PlayerActionTypes.UPDATE_CURRENT:
      return Object.assign({}, state, {
        currentMillis: payload.currentMillis
      });

    default:
      return state;
  }
}
