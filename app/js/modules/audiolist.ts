import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";
import { toFiles } from "./helper/FileSystem";
import { loadAsAudioBuffer } from "./helper/AudioContext";
import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";
import Audio from "./model/Audio";

export enum AudioListActionTypes {
  SELECT = "c_tune/audio-list/select"
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
}

const initialState: AudioListState = {
  list: []
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

    default:
      return state;
  }
}
