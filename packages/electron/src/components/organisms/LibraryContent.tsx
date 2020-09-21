import React, { FC } from "react";
import { jsx } from "@emotion/core";
import {
  openAudioFileSelectDialog,
  readAsArrayBuffer,
  readMusicMetadata
} from "../../utils/mainProcessBridge";

const LibraryContent: FC = () => {
  const loadAudio = async () => {
    const audioFilePaths = await openAudioFileSelectDialog();
    if (audioFilePaths) {
      const ab = await readAsArrayBuffer(audioFilePaths[0]);
      const result = await readMusicMetadata(audioFilePaths[0]);
      console.log(ab);
      console.log(result);
    }
  };

  return (
    <div>
      <h1>Library</h1>
      <button onClick={loadAudio}>LOAD</button>
    </div>
  );
};

export default LibraryContent;
