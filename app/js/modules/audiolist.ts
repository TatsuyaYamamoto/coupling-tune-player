import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { States } from "./redux";
import Track from "./model/Track";
import { loadAsAudioBuffer } from "./helper/AudioContext";
import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";
import { loadAsAudio, readAsDataURL } from "./helper/FileSystem";

export enum Actions {
  SELECT_REQUEST = "c_tune/audio-list/select_request",
  SELECT_SUCCESS = "c_tune/audio-list/select_success",
  SELECT_FAILURE = "c_tune/audio-list/select_failure",
  LOAD_AUDIO_REQUEST = "c_tune/audio-list/load_audio_request",
  LOAD_AUDIO_SUCCESS = "c_tune/audio-list/load_audio_success",
  LOAD_AUDIO_FAILURE = "c_tune/audio-list/load_audio_failure",
  GO_INDEX = "c_tune/audio-list/go_index"
}

/**
 * 音声ファイルを選択する
 *
 * @param {File[]} files
 * @param {"left" | "right"} type
 * @returns {ThunkAction<Promise<void>, States, any>}
 */
export const select = (
  files: File[],
  type: "left" | "right"
): ThunkAction<Promise<void>, States, any> => async (dispatch, getState) => {
  dispatch({ type: Actions.SELECT_REQUEST });

  for (const file of files) {
    const { title, artist, pictureBase64 } = await loadTags(file);
    console.log("Loaded media tag.", title, artist);

    const dataUrl = await readAsDataURL(file);
    const audio = await loadAsAudio(dataUrl);

    const track = new Track({
      file,
      artist,
      pictureBase64,
      title: title || file.name,
      duration: audio.duration
    });
    const currentList = getState().audiolist.list;

    const updatedList = mergeToList(type, track, currentList);

    dispatch({
      type: Actions.LOAD_AUDIO_SUCCESS,
      payload: { list: updatedList }
    });
  }

  dispatch({ type: Actions.SELECT_SUCCESS });
};

export const goIndex = (index: number) => (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const { list } = getState().audiolist;
  const min = 0;
  const max = list.length - 1;
  if (!(min <= index || index <= max)) {
    console.error(
      `Provided index, ${index}, is out of list range. ${min} <= index <= ${max}`
    );

    return;
  }
  const left = list[index].left;
  const right = list[index].right;
  if (!left || !right) {
    console.error(
      `Left and right audio of provided index are not ready. left: ${!!left}, right: ${!!right}.`
    );
    return;
  }

  dispatch({
    type: Actions.GO_INDEX,
    payload: { index }
  });
};

export const goPrevIndex = () => (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const { playingIndex: currentIndex, list } = getState().audiolist;

  if (currentIndex === null) {
    console.error(
      `Current playing index is null. ignore to request of go next index of audio list.`
    );
    return;
  }
  const from = currentIndex - 1;
  const to = 0;

  if (from < to) {
    console.error(`invalid range. from: ${from}, to: ${to}`);
    return;
  }

  // tslint:disable-next-line:no-increment-decrement
  for (let i = from; 0 <= to; i--) {
    const candidate = list[i];
    if (candidate && candidate.left && candidate.right) {
      dispatch(goIndex(i));
      return;
    }
  }

  console.error("Could not find valid audio from list.");
};

export const goNextIndex = (): ThunkAction<void, States, any> => (
  dispatch,
  getState
) => {
  const { playingIndex: currentIndex, list } = getState().audiolist;

  if (currentIndex === null) {
    console.error(
      `Current playing index is null. ignore to request of go next index of audio list.`
    );
    return;
  }

  const from = currentIndex + 1;
  const to = list.length - 1;

  if (to < from) {
    console.error(`invalid range. from: ${from}, to: ${to}`);
    return;
  }

  // tslint:disable-next-line:no-increment-decrement
  for (let i = from; i <= to; i++) {
    const candidate = list[i];
    if (candidate && candidate.left && candidate.right) {
      dispatch(goIndex(i));
      return;
    }
  }

  console.error("Could not find valid audio from list.");
};

/**
 * get updated Track List.
 *
 * @param {"left" | "right"} type
 * @param {Track} provided
 * @param {AudioListItem[]} currentList
 * @returns {AudioListItem[]}
 */
function mergeToList(
  type: "left" | "right",
  provided: Track,
  currentList: AudioListItem[]
): AudioListItem[] {
  const otherSideType = type === "left" ? "right" : "left";
  let newTrack = true;

  const updatedList = currentList.map(item => {
    const ownSide = item[type];
    const otherSide = item[otherSideType];

    if (
      (ownSide && matchTitle(provided.title, ownSide.title)) ||
      (otherSide && matchTitle(provided.title, otherSide.title))
    ) {
      newTrack = false;

      return {
        ...item,
        [type]: provided
      };
    }

    return item;
  });

  if (newTrack) {
    updatedList.push({
      left: type === "left" ? provided : null,
      right: type === "right" ? provided : null
    });
  }

  return updatedList;
}

/**
 * Return true if judged that provide titles are same.
 *
 * @param {string} title1
 * @param {string} title2
 * @param {number} threshold
 * @returns {boolean}
 */
function matchTitle(
  title1: string,
  title2: string,
  threshold: number = 3
): boolean {
  if (title1.length <= threshold) {
    return title1 === title2;
  }

  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < title1.length - threshold; i++) {
    if (title2.indexOf(title1.substr(i, threshold)) !== -1) {
      return true;
    }
  }

  return false;
}

export interface AudioListItem {
  left: Track | null;
  right: Track | null;
}

export interface AudioListState {
  list: AudioListItem[];
  playingIndex: number | null;
  loading: boolean;
}

const initialState: AudioListState = {
  list: [],
  playingIndex: null,
  loading: false
};

/**
 * Reducer of {@code audiolist} state.
 *
 * @param {AudioListState} state
 * @param {any} type
 * @param {any} payload
 * @returns {AudioListState}
 */
export default function reducer(
  state: AudioListState = initialState,
  { type, payload }: AnyAction
): AudioListState {
  switch (type) {
    case Actions.SELECT_REQUEST:
      return {
        ...state,
        loading: true
      };

    case Actions.SELECT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case Actions.LOAD_AUDIO_SUCCESS:
      return {
        ...state,
        list: payload.list
      };

    case Actions.GO_INDEX:
      return {
        ...state,
        playingIndex: payload.index
      };

    default:
      return state;
  }
}
