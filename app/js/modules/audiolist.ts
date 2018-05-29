import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";
import { toFiles } from "./helper/FileSystem";
import { loadAsAudioBuffer } from "./helper/AudioContext";
import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";
import Audio from "./model/Audio";

export enum AudioListActionTypes {
  SELECT = "c_tune/audio-list/select",
  GO_INDEX = "c_tune/audio-list/go_index"
}

/**
 * 音声ファイルを選択する
 *
 * @param {FileList} fileList
 * @param {"left" | "right"} type
 * @returns {(dispatch: Dispatch<States>) => Promise<{type: AudioListActionTypes; payload: {type: "left" | "right"; files: File[]}}>}
 */
export const select = (fileList: FileList, type: "left" | "right") => async (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const files = toFiles(fileList);
  const audios = [];
  for (const file of files) {
    const audioBuffer = await loadAsAudioBuffer(file);
    console.log("Loaded audio buffer. length: " + audioBuffer.length);

    const { title, artist, pictureBase64 } = await loadTags(file);
    console.log("Loaded media tag.", title, artist);

    const { bpm, startPosition } = await analyzeBpm(audioBuffer);
    console.log("Analyzed BPM.", bpm);

    audios.push(
      new Audio({
        file,
        audioBuffer,
        artist,
        pictureBase64,
        bpm,
        startPosition,
        title: title || file.name
      })
    );
  }
  console.log("Load audios", audios);

  const updatedList = mergeList(type, audios, getState().audiolist.list);
  console.log("Merged list", audios);

  dispatch({
    type: AudioListActionTypes.SELECT,
    payload: { type, list: updatedList }
  });
};

export const goIndex = (index: number) => (
  dispatch: Dispatch<States>,
  getState: () => States
) => {
  const { list, playingIndex } = getState().audiolist;
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
    type: AudioListActionTypes.GO_INDEX,
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

export const goNextIndex = () => (
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

function mergeList(
  type: "left" | "right",
  providedItems: Audio[],
  currentList: AudioListItem[]
) {
  const updatedList: AudioListItem[] = [...currentList];
  const targetType = type === "left" ? "right" : "left";

  providedItems.forEach(provided => {
    let match = false;
    for (const item of updatedList) {
      const target = item[targetType];
      if (!target) {
        continue;
      }

      if (matchTitle(provided.title, target.title)) {
        item[type] = provided;
        match = true;
      }
    }
    if (!match) {
      updatedList.push({
        left: type === "left" ? provided : null,
        right: type === "right" ? provided : null
      });
    }
  });

  return updatedList;
}

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
  left: Audio | null;
  right: Audio | null;
}

export interface AudioListState {
  list: AudioListItem[];
  playingIndex: number | null;
}

const initialState: AudioListState = {
  list: [],
  playingIndex: null
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
    case AudioListActionTypes.SELECT:
      return {
        ...state,
        list: payload.list
      };

    case AudioListActionTypes.GO_INDEX:
      return {
        ...state,
        playingIndex: payload.index
      };

    default:
      return state;
  }
}
