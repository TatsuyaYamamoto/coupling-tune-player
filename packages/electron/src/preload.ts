import { contextBridge, ipcRenderer, OpenDialogReturnValue } from "electron";

import { AudioFile } from "./models/AudioFile";

declare global {
  interface Window {
    electron: {
      openFileSelectDialog: () => Promise<OpenDialogReturnValue>;
      readAudioFiles: (path: string) => Promise<string[]>;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  openFileSelectDialog: () => {
    return ipcRenderer.invoke("open-file-select-dialog");
  },
  readAudioFiles: (path: string) => {
    return ipcRenderer.invoke("read-audio-files", path);
  }
});
