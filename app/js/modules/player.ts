import {AnyAction, Dispatch} from "redux";
import {States} from "./redux";

import {loadTags, Tag} from "./helper/TagLoader";
import {analyzeBpm} from "./helper/BpmAnalyzer";

export enum PlayerActionTypes {
  LOAD_BUFFER_SUCCESS = "c_tune/player/load_buffer_success",
  LOAD_TAG_SUCCESS = "c_tune/player/load_tag_success",
  ANALYZE_BPM_SUCCESS = "c_tune/player/analyze_bpm_success",
  PLAY = "c_tune/player/play",
  PAUSE = "c_tune/player/pause",
  UPDATE_CURRENT = "c_tune/player/update_current",
}

// TODO Check supporting WebAudioAPI
const context = new AudioContext();
let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;
let lastCheckTime: number | null = null;

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

    dispatch(loadAudioTag(file, type));
    const audioBuffer = await dispatch(loadAsAudioBuffer(file, type));
    if (audioBuffer) {
      dispatch(analyzeAudioBpm(audioBuffer, type));
    }
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
    const tag = await loadTags(file)
      .catch((e) => console.error(e));

    dispatch({
      type: PlayerActionTypes.LOAD_TAG_SUCCESS,
      payload: {type, tag},
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
      .then(() => new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(file);
      }))
      .then((arrayBuffer: ArrayBuffer) => context.decodeAudioData(arrayBuffer))
      .catch((e) => console.error(e));

    dispatch({
      type: PlayerActionTypes.LOAD_BUFFER_SUCCESS,
      payload: {type, audioBuffer},
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

    const result = await analyzeBpm(audio)
      .catch((e) => console.error(e));

    const payload = {} as any;
    payload.type = type;
    payload.bpm = result && result.bpm;
    payload.startPositionMillis = result && result.startPosition * 1000;

    dispatch({
      type: PlayerActionTypes.ANALYZE_BPM_SUCCESS,
      payload,
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
    const {
      left,
      right,
      currentMillis,
    } = getState().player;

    if (!left.buffer || !right.buffer) {
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
    console.log("currentMillis", currentMillis);
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
      type: PlayerActionTypes.PLAY,
    });

    setInterval(() => {
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
  return (dispatch: Dispatch<States>, getState: () => States) => {
    const {playing} = getState().player;

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

    dispatch({
      type: PlayerActionTypes.PAUSE,
    });
  };
}

/**
 * 現在の再生時間を更新する
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export function updateCurrentTime() {
  return (dispatch: Dispatch<States>, getState: () => States) => {
    const {
      playing,
      currentMillis,
    } = getState().player;

    if (!playing) {
      console.error("Player is not running.");
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
        currentMillis: currentMillis + add,
      },
    });
  };
}

interface AudioState {
  buffer: AudioBuffer | null;
  tag: Tag;
  bpm: number;
  startPositionMillis: number | null;
}

export interface PlayerState {
  playing: boolean;
  durationMillis: number;
  currentMillis: number;
  left: AudioState;
  right: AudioState;
}

const initialState: PlayerState = {
  playing: false,
  durationMillis: 0,
  currentMillis: 0,
  left: {
    buffer: null,
    tag: {
      title: null,
      artist: null,
      pictureBase64: null,
    },
    bpm: 0,
    startPositionMillis: null,
  },
  right: {
    buffer: null,
    tag: {
      title: null,
      artist: null,
      pictureBase64: null,
    },
    bpm: 0,
    startPositionMillis: null,
  },
};

export default function reducer(state: PlayerState = initialState, action: AnyAction): PlayerState {
  const {type, payload} = action;

  switch (type) {

    case PlayerActionTypes.LOAD_BUFFER_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign({}, payload.type === "right" ? state.right : state.left, {
          buffer: payload.audioBuffer,
        }),
      });

    case PlayerActionTypes.ANALYZE_BPM_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign({}, payload.type === "right" ? state.right : state.left, {
          bpm: payload.bpm,
          startPositionMillis: payload.startPositionMillis,
        }),
      });

    case PlayerActionTypes.LOAD_TAG_SUCCESS:
      return Object.assign({}, state, {
        [payload.type]: Object.assign({}, payload.type === "right" ? state.right : state.left, {
          tag: payload.tag,
        }),
      });

    case PlayerActionTypes.PLAY:
      return Object.assign({}, state, {
        playing: true,
      });

    case PlayerActionTypes.PAUSE:
      return Object.assign({}, state, {
        playing: false,
      });

    case PlayerActionTypes.UPDATE_CURRENT:
      return Object.assign({}, state, {
        currentMillis: payload.currentMillis,
      });

    default:
      return state;
  }
}
