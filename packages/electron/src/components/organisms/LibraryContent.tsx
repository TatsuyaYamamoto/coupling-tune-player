import React, { FC } from "react";
import { jsx } from "@emotion/core";
import useElectronMainProcess from "../hooks/useElectronMainProcess";

const LibraryContent: FC = () => {
  const { openFileSelectDialog } = useElectronMainProcess();

  return (
    <div>
      <h1>Library</h1>
      <button onClick={() => openFileSelectDialog()}>open</button>
    </div>
  );
};

export default LibraryContent;
