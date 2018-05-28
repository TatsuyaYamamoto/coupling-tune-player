import { AnyAction, Dispatch } from "redux";
import { States } from "./redux";
import { toFiles } from "./helper/FileSystem";

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
  dispatch: Dispatch<States>
) => {
  const files = toFiles(fileList);

  dispatch({
    type: AudioListActionTypes.SELECT,
    payload: {
      type,
      files
    }
  });
};

export interface AudioItemState {
  name: string;
}

export interface AudioListState {
  left: AudioItemState[];
  right: AudioItemState[];
}

const initialState: AudioListState = {
  left: [],
  right: []
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
