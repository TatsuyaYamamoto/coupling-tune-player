import { IpcRendererEvent } from "electron";

export const openAudioFileSelectDialog = async () => {
  const { canceled, filePaths } = await window.electron.openFileSelectDialog();

  if (canceled) {
    return;
  }
  console.log("selected file paths: ", filePaths);

  const audioFilePaths: string[] = [];

  await Promise.all(
    filePaths.map(async (path) => {
      const audioFiles = await window.electron.readAudioFiles(path);
      audioFilePaths.push(...audioFiles);
    })
  );
  console.log("loaded audio files: ", audioFilePaths.length);

  return audioFilePaths;
};

export const readAsArrayBuffer = async (path: string) => {
  return window.electron.readAsBuffer(path).then((array) => array.buffer);
};

export const readMusicMetadata = (path: string) => {
  return window.electron.readMusicMetadata(path);
};

export const ipcRendererOn = (
  channel: string,
  listener: (event: IpcRendererEvent, ...args: any[]) => void
) => {
  return window.electron.ipcRendererOn(channel, listener);
};

export const ipcRendererOff = (
  event: string | symbol,
  listener: (...args: any[]) => void
) => {
  return window.electron.ipcRendererOff(event, listener);
};
