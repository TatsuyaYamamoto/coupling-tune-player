import { AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { States } from "../store";
import Song from "../model/Song";
import TrackListIndex from "../model/TrackListIndex";
import TrackList from "../model/TrackList";
import { loadTags } from "../../helper/TagLoader";
import { loadAsAudio, readAsDataURL } from "../../helper/FileSystem";

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

    const track = new Song({
      file,
      artist,
      pictureBase64,
      title: title || file.name
    });
    const currentList = getState().tracklist.list;
    const updatedList = currentList.merge(type, track);

    dispatch({
      type: Actions.LOAD_AUDIO_SUCCESS,
      payload: { list: updatedList }
    });
  }

  dispatch({ type: Actions.SELECT_SUCCESS });
};

export const goIndex = (index: TrackListIndex) => (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const { list } = getState().tracklist;

  if (!(list.min().value <= index.value || index.value <= list.max().value)) {
    console.error(
      `Provided index, ${index}, is out of list range. ${list.min()} <= index <= ${list.max()}`
    );

    return;
  }
  const left = list.get(index).left;
  const right = list.get(index).right;
  if (!left || !right) {
    console.error(
      `Left and right audio of provided index are not ready. left: ${!!left}, right: ${!!right}.`
    );
    return;
  }

  let prevIndex: TrackListIndex | null = null;
  if (!list.min().equals(index)) {
    // tslint:disable-next-line:no-increment-decrement
    for (let i = index.value - 1; 0 <= i; i--) {
      const candidate = list.get(new TrackListIndex(i));
      if (candidate && candidate.left && candidate.right) {
        prevIndex = new TrackListIndex(i);
        break;
      }
    }
  }

  let nextIndex: TrackListIndex | null = null;
  if (!list.max().equals(index)) {
    // tslint:disable-next-line:no-increment-decrement
    for (let i = index.value + 1; i < list.size(); i++) {
      const candidate = list.get(new TrackListIndex(i));
      if (candidate && candidate.left && candidate.right) {
        nextIndex = new TrackListIndex(i);
        break;
      }
    }
  }

  dispatch({
    type: Actions.GO_INDEX,
    payload: { index, prevIndex, nextIndex }
  });
};

export const goPrevIndex = () => (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const { prevIndex } = getState().tracklist;

  if (prevIndex === null) {
    console.error(
      `Prev index is null. ignore to request of go next index of audio list.`
    );
    return;
  }

  dispatch(goIndex(prevIndex));
};

export const goNextIndex = (): ThunkAction<void, States, any> => (
  dispatch,
  getState
) => {
  const { nextIndex } = getState().tracklist;

  if (nextIndex === null) {
    console.error(
      `Next index is null. ignore to request of go next index of audio list.`
    );
    return;
  }

  dispatch(goIndex(nextIndex));
};

export interface TrackListState {
  list: TrackList;
  focusIndex: TrackListIndex | null;
  prevIndex: TrackListIndex | null;
  nextIndex: TrackListIndex | null;
  loading: boolean;
}

const initialState: TrackListState = {
  list: new TrackList([]),
  focusIndex: null,
  prevIndex: null,
  nextIndex: null,
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
  state: TrackListState = initialState,
  { type, payload }: AnyAction
): TrackListState {
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
        focusIndex: payload.index,
        prevIndex: payload.prevIndex,
        nextIndex: payload.nextIndex
      };

    default:
      return state;
  }
}
