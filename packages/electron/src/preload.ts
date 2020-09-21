import { contextBridge, ipcRenderer, OpenDialogReturnValue } from "electron";
import { IAudioMetadata } from "music-metadata";

declare global {
  interface Window {
    electron: {
      openFileSelectDialog: () => Promise<OpenDialogReturnValue>;
      readAudioFiles: (path: string) => Promise<string[]>;
      readAsBuffer: (path: string) => Promise<Uint8Array>;
      readMusicMetadata: (path: string) => Promise<IAudioMetadata>;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  openFileSelectDialog: () => {
    return ipcRenderer.invoke("open-file-select-dialog");
  },
  readAudioFiles: (path: string) => {
    return ipcRenderer.invoke("read-audio-files", path);
  },
  readAsBuffer: (path: string) => {
    return ipcRenderer.invoke("read-as-buffer", path);
  },
  readMusicMetadata: (path: string) => {
    return ipcRenderer.invoke("read-music-metadata", path);
  }
});
