import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { parseFile } from "music-metadata";
import { readBuffer, readFileRecursively } from "./utils/fs";

import "./menu";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

console.log(`
===================================
app#name: ${app.name}
app#isPackaged: ${app.isPackaged}
userData: ${app.getPath("userData")}

platform: ${process.platform}
system version: ${process.getSystemVersion()}
===================================
`);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;
const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("open-file-select-dialog", () => {
  return dialog.showOpenDialog(mainWindow, {
    filters: [{ name: "Audios", extensions: ["wav", "mp3", "aac", "wma"] }],
    properties: ["openFile", "openDirectory", "multiSelections"],
  });
});

ipcMain.handle("read-audio-files", async (_, path: string) => {
  const filePaths = await readFileRecursively(path);
  const supportExtensions = [".mp3", ".wav"];
  return filePaths.filter((path) => {
    for (const s of supportExtensions) {
      if (path.toLowerCase().endsWith(s)) {
        return true;
      }
    }
    return false;
  });
});

ipcMain.handle("read-as-buffer", async (_, path: string) => {
  return readBuffer(path).then((buf) => new Uint8Array(buf));
});

ipcMain.handle("read-music-metadata", async (_, path: string) => {
  // @ts-ignore
  return parseFile(path);
});
