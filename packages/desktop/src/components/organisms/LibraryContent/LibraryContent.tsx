/** @jsx jsx */
import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/core";

import CouplingTrackTable from "../CouplingTrackTable/CouplingTrackTable";
import LibraryHeader from "./LibraryHeader";

import {
  openAudioFileSelectDialog,
  readAsArrayBuffer,
} from "../../../utils/mainProcessBridge";
import useLibrary from "../../hooks/useLibrary";
import usePlayer from "../../hooks/usePlayer";

const LibraryContent: FC = () => {
  const [selectedTracks, setSelectedTracks] = useState<
    {
      title: string;
      artist: string;
    }[]
  >([]);
  const { tracks, loadTracks } = useLibrary();
  const { setTracks } = usePlayer();

  const onLoadRequest = async () => {
    const audioFilePaths = await openAudioFileSelectDialog();

    if (audioFilePaths) {
      loadTracks(audioFilePaths);
    }
  };

  const onSelectTrack = async (
    params: {
      title: string;
      artist: string;
    }[]
  ) => {
    setSelectedTracks(params);

    const title = params[0].title;
    const couplingTrack = tracks.find((track) => track.title === title);
    if (!couplingTrack) {
      return;
    }

    const audioFilePaths = couplingTrack.tracks
      .filter((t) => !!params.find((p) => p.artist === t.artist))
      .map((track) => track.audioFilePath);

    setTracks(audioFilePaths);
  };

  return (
    <div>
      <LibraryHeader
        css={css`
          min-width: 700px;
          margin: 30px 50px;
        `}
        onLoadRequest={onLoadRequest}
      />
      <CouplingTrackTable
        css={css`
          margin: 0 50px;
        `}
        tracks={tracks}
        selectedTracks={selectedTracks}
        onSelectTrack={onSelectTrack}
      />
    </div>
  );
};

export default LibraryContent;
