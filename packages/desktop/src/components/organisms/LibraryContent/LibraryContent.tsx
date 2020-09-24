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

    if (params.length === 0) {
      // select no item.
      return;
    }

    const { title } = params[0];
    const couplingTrack = tracks.find((track) => track.title === title);
    if (!couplingTrack) {
      return;
    }

    const trackList = couplingTrack.tracks.filter(
      (t) => !!params.find((p) => p.artist === t.artist)
    );

    const audioFilePaths = trackList.map((track) => track.audioFilePath);
    setTracks(audioFilePaths, trackList[0].durationSeconds);
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
