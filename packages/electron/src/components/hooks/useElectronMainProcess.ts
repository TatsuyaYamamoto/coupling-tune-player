const useElectronMainProcess = () => {
  const openFileSelectDialog = async () => {
    const {
      canceled,
      filePaths
    } = await window.electron.openFileSelectDialog();

    if (canceled) {
      return;
    }
    console.log("selected file paths: ", filePaths);

    const audioFilePaths: string[] = [];

    await Promise.all(
      filePaths.map(async path => {
        const audioFiles = await window.electron.readAudioFiles(path);
        audioFilePaths.push(...audioFiles);
      })
    );
    console.log("loaded audio files: ", audioFilePaths.length);
  };

  return { openFileSelectDialog };
};

export default useElectronMainProcess;
