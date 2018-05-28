import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";

import { loadTags } from "./helper/TagLoader";
import { analyzeBpm } from "./helper/BpmAnalyzer";
import Timer = NodeJS.Timer;
import Audio from "./helper/Audio";

export enum AudioListActionTypes {
  SELECT = "c_tune/audio-list/select"
}

export const select = (
  fileList: FileList,
  type: "left" | "right"
) => async () => {
  const files = <File[]>[...Array(fileList.length)]
    .fill(0)
    .map((_, i) => fileList.item(i));

  return {
    type: AudioListActionTypes.SELECT,
    payload: {
      type,
      files
    }
  };
};

export interface AudioItemState {
  left: Audio | null;
  right: Audio | null;
}

export interface AudioListState {
  list: AudioItemState[];
}

const initialState: AudioListState = {
  list: []
};

export default function reducer(
  state: AudioListState = initialState,
  { type, payload }: AnyAction
): AudioListState {
  switch (type) {
    case AudioListActionTypes.SELECT:
      return {
        ...state,
        [payload.type]: payload.files
      };

    default:
      return state;
  }
}
