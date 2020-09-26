/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useEffect, useRef, useState } from "react";
import { PlayerController } from "@coupling-tune-player/share";

import usePlayer from "../components/hooks/usePlayer";
import useLibrary from "../components/hooks/useLibrary";
import CouplingTrackTable from "../components/organisms/CouplingTrackTable/CouplingTrackTable";

import {
  ipcRendererOn,
  openAudioFileSelectDialog,
} from "../utils/mainProcessBridge";
import DragImportOverlay from "../components/organisms/DragImportOverlay";
import SimpleAlert from "../components/organisms/SimpleAlert";

const LibraryPage: FC = () => {
  const {
    play: startPlayer,
    pause: pausePlayer,
    state: playerState,
    updateCurrentTime,
    duration,
    current,
    setTracks,
  } = usePlayer();
  const { tracks, loadTracks } = useLibrary();

  const [selectedTracks, setSelectedTracks] = useState<
    {
      title: string;
      artist: string;
    }[]
  >([]);
  const [showSelectGuide, handleSelectGuide] = useState(false);

  const onPlay = () => {
    startPlayer();
  };

  const onPause = () => {
    pausePlayer();
  };

  const onSlided = (newCurrentTime: number) => {
    updateCurrentTime(newCurrentTime);
  };

  const onLoadRequest = async () => {
    const audioFilePaths = await openAudioFileSelectDialog();
    console.log(`file is selected.`, audioFilePaths);

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

  const onSelectGuideClose = () => {
    handleSelectGuide(false);
  };

  const onFileDropped = (files: FileList) => {
    console.log(`files are dropped`, files);

    const audioFileOrDirPath: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type === "" || file.type.startsWith("audio/")) {
        audioFileOrDirPath.push(file.path);
      }
    });

    if (audioFileOrDirPath.length === 0) {
      handleSelectGuide(true);
      return;
    }

    loadTracks(audioFileOrDirPath);
  };

  useEffect(() => {
    ipcRendererOn("on-click-menu-file-import", () => {
      onLoadRequest();
    });
  }, []);

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
      `}
    >
      <main
        css={css`
          flex-grow: 1;
          height: calc(100vh - 149px);
          overflow-x: auto;
        `}
      >
        <CouplingTrackTable
          css={css`
            margin: 50px 50px 0;
          `}
          tracks={tracks}
          selectedTracks={selectedTracks}
          onSelectTrack={onSelectTrack}
        />
      </main>
      <PlayerController
        css={css`
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 10;
        `}
        playerState={playerState}
        duration={duration}
        current={current}
        hasPrev={false}
        hasNext={false}
        onPlay={onPlay}
        onPause={onPause}
        onNextTrack={() => {}}
        onPrevTrack={() => {}}
        onSlided={onSlided}
      />

      <DragImportOverlay onFileDropped={onFileDropped} />
      <SimpleAlert open={showSelectGuide} onClose={onSelectGuideClose}>
        音声ファイルか、フォルダを選択してください。
      </SimpleAlert>
    </div>
  );
};

export default LibraryPage;
