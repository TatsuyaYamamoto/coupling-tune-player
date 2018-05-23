import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";

import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";
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

// TODO Check supporting WebAudioAPI
const AudioContext =
  (window as any).AudioContext || (window as any).webkitAudioContext;
const context: AudioContext = new AudioContext();
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

    const audioBuffer = await dispatch(loadAsAudioBuffer(file, type));
    if (audioBuffer) {
      await dispatch(analyzeAudioBpm(audioBuffer, type));
    }

    await dispatch(loadAudioTag(file, type));

    dispatch({ type: PlayerActionTypes.LOAD_SUCCESS });
  };
}

/**
 * {@code File}からメディア情報を読み込む
 *
 * @param {File} file
 * @param {"right" | "left"} type
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => Promise<void>}
 */
function loadAudioTag(file: File, type: "right" | "left") {
  return async (dispatch: Dispatch<States>) => {
    const tag = await loadTags(file).catch(e => console.error(e));

    console.log("Loaded tags", tag);

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
  };
}

/**
 * {@cod File}を{@code AudioBuffer}としてロードする。
 *
 * @param {File} file
 * @param {"right" | "left"} type
 * @returns {(dispatch: Dispatch<States>) => Promise<AudioBuffer | void>}
 */
function loadAsAudioBuffer(file: File, type: "right" | "left") {
  return async (dispatch: Dispatch<States>): Promise<AudioBuffer | void> => {
    const audioBuffer = await Promise.resolve()
      .then(
        () =>
          new Promise<ArrayBuffer>(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsArrayBuffer(file);
          })
      )
      .then((arrayBuffer: ArrayBuffer) => context.decodeAudioData(arrayBuffer))
      .catch(e => console.error(e));

    dispatch({
      type: PlayerActionTypes.LOAD_BUFFER_SUCCESS,
      payload: { type, audioBuffer }
    });

    return audioBuffer;
  };
}

/**
 * BPMを解析する。
 *
 * @param {AudioBuffer} audio
 * @param {"right" | "left"} type
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => Promise<void>}
 */
function analyzeAudioBpm(audio: AudioBuffer, type: "right" | "left") {
  return async (dispatch: Dispatch<States>): Promise<void> => {
    const result = await analyzeBpm(audio);

    console.log("analyzed BPM", result);

    const payload = {} as any;
    payload.type = type;
    payload.bpm = result.bpm;
    payload.startPositionMillis = result && result.startPosition * 1000;

    dispatch({
      payload,
      type: PlayerActionTypes.ANALYZE_BPM_SUCCESS
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
    const { left, right, currentMillis } = getState().player;

    if (!left || !right) {
      console.error("No audio buffer of right or left.");
      return;
    }

    if (!left.startPositionMillis || !right.startPositionMillis) {
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
    let leftAudioOffset = currentMillis;
    let rightAudioOffset = currentMillis;
    const diffMillis = left.startPositionMillis - right.startPositionMillis;

    if (0 < diffMillis) {
      leftAudioOffset += diffMillis;
    } else {
      rightAudioOffset += -1 * diffMillis;
    }

    leftAudioSource.start(0, leftAudioOffset / 1000);
    rightAudioSource.start(0, rightAudioOffset / 1000);

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
    const { currentMillis } = getState().player;

    if (time) {
      dispatch({
        type: PlayerActionTypes.UPDATE_CURRENT,
        payload: { currentMillis: time }
      });
      return;
    }

    const now = context.currentTime * 1000;
    if (lastCheckTime == null) {
      lastCheckTime = now;
      return;
    }

    const add = now - lastCheckTime;
    lastCheckTime = now;

    dispatch({
      type: PlayerActionTypes.UPDATE_CURRENT,
      payload: {
        currentMillis: currentMillis + add
      }
    });
  };
}

export interface AudioState {
  buffer: AudioBuffer;
  title: string;
  artist: string | null;
  pictureBase64: string | null;
  bpm: number;
  startPositionMillis: number;
}

export interface PlayerState {
  loading: boolean;
  playing: boolean;
  durationMillis: number;
  currentMillis: number;
  left: AudioState | null;
  right: AudioState | null;
}

const initialState: PlayerState = {
  loading: false,
  playing: false,
  durationMillis: 0,
  currentMillis: 0,
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
