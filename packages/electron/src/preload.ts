import { contextBridge, ipcRenderer, OpenDialogReturnValue } from "electron";

declare global {
  interface Window {
    electron: {
      openFileSelectDialog: () => Promise<OpenDialogReturnValue>;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  openFileSelectDialog: () => {
    return ipcRenderer.invoke("open-file-select-dialog");
  }
});
