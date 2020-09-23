/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useState } from "react";
import { PlayerController } from "@coupling-tune-player/share";

import usePlayer from "../components/hooks/usePlayer";
import Drawer from "../components/organisms/Drawer";
import LibraryContent from "../components/organisms/LibraryContent/LibraryContent";
import PlaylistContent from "../components/organisms/PlaylistContent";

type RenderingView = "library" | "playlist";

const IndexPage: FC = () => {
  const {
    play: startPlayer,
    pause: pausePlayer,
    state: playerState,
    updateCurrentTime,
    duration,
    current,
  } = usePlayer();
  const [renderingView, setRenderingView] = useState<RenderingView>("library");

  const onClickMenu = (value: "library" | "playlist" | "help") => {
    if (value === "help") {
      // do nothing
    } else {
      setRenderingView(value);
    }
  };

  const onPlay = () => {
    startPlayer();
  };

  const onPause = () => {
    pausePlayer();
  };

  const onSlided = (newCurrentTime: number) => {
    updateCurrentTime(newCurrentTime);
  };

  return (
    <div>
      <div
        css={css`
          display: flex;
        `}
      >
        <Drawer onClickMenu={onClickMenu} />
        <main
          css={css`
            flex-grow: 1;
            height: calc(100vh - 149px);
            overflow-x: auto;
          `}
        >
          {renderingView === "library" && <LibraryContent />}
          {renderingView === "playlist" && <PlaylistContent />}
        </main>
      </div>
      <PlayerController
        css={css`
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 9999;
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
    </div>
  );
};

export default IndexPage;
