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
}

// TODO Check supporting WebAudioAPI
const context = new AudioContext();
let leftAudioSource: AudioBufferSourceNode | null = null;
let rightAudioSource: AudioBufferSourceNode | null = null;

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

    dispatch({
      type: PlayerActionTypes.ANALYZE_BPM_SUCCESS,
      payload: {type, result},
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

    const diffMillis = left.startPosition - right.startPosition;

    let leftAudioOffset = currentMillis;
    let rightAudioOffset = currentMillis;

    if (0 < diffMillis) {
      leftAudioOffset += diffMillis;

    } else {
      rightAudioOffset += -1 * diffMillis;
    }

    const now = context.currentTime;
    leftAudioSource.start(0, leftAudioOffset);
    rightAudioSource.start(0, rightAudioOffset);

    dispatch({
      type: PlayerActionTypes.PLAY,
      payload: {
        playing: true,
        playStartContextTimeMillis: now,
      },
    });
  };
}

/**
 * 音声の再生を停止する。
 *
 * @returns {(dispatch: Dispatch<States>, getState: () => States) => undefined}
 */
export function pause() {
  return (dispatch: Dispatch<States>, getState: () => States) => {
    const {
      playing,
    } = getState().player;

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

    dispatch({
      type: PlayerActionTypes.PAUSE,
      payload: {
        playing: false,
      },
    });
  };
}

interface AudioState {
  buffer: AudioBuffer | null;
  tag: Tag;
  bpm: number;
  startPosition: number | null;
}

export interface PlayerState {
  playing: boolean;
  playStartContextTimeMillis: number;
  durationMillis: number;
  currentMillis: number;
  diffMillis: number;
  left: AudioState;
  right: AudioState;
}

const initialState: PlayerState = {
  playing: false,
  playStartContextTimeMillis: context.currentTime,
  durationMillis: 0,
  currentMillis: 0,
  diffMillis: 0,
  left: {
    buffer: null,
    tag: {
      title: null,
      artist: null,
      pictureBase64: null,
    },
    bpm: 0,
    startPosition: null,
  },
  right: {
    buffer: null,
    tag: {
      title: null,
      artist: null,
      pictureBase64: null,
    },
    bpm: 0,
    startPosition: null,
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
          bpm: payload.result.bpm,
          startPosition: payload.result.startPosition,
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
        playing: payload.playing,
      });

    case PlayerActionTypes.PAUSE:
      return Object.assign({}, state, {
        playing: payload.playing,
      });

    default:
      return state;
  }
}
