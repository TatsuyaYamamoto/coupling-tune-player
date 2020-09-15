const useElectronMainProcess = () => {
  const openFileSelectDialog = async () => {
    const {
      canceled,
      filePaths
    } = await window.electron.openFileSelectDialog();

    if (!canceled) {
      console.log(filePaths);
    }
  };

  return { openFileSelectDialog };
};

export default useElectronMainProcess;
