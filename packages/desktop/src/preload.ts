import {
  contextBridge,
  IpcRenderer,
  ipcRenderer,
  IpcRendererEvent,
  OpenDialogReturnValue,
} from "electron";
import { IAudioMetadata } from "music-metadata";

declare global {
  interface Window {
    electron: {
      ipcRendererOn: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => IpcRenderer;
      ipcRendererOff: (
        event: string | symbol,
        listener: (...args: any[]) => void
      ) => IpcRenderer;
      openFileSelectDialog: () => Promise<OpenDialogReturnValue>;
      readAudioFiles: (path: string) => Promise<string[]>;
      readAsBuffer: (path: string) => Promise<Uint8Array>;
      readMusicMetadata: (path: string) => Promise<IAudioMetadata>;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  ipcRendererOn: (channel: any, func: any) => {
    ipcRenderer.on(channel, func);
  },
  ipcRendererOff: (channel: any, func: any) => {
    ipcRenderer.off(channel, func);
  },
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
  },
});
