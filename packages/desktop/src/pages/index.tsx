/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useEffect, useState } from "react";
import { PlayerController } from "@coupling-tune-player/share";

import Drawer from "../components/organisms/Drawer";
import LibraryContent from "../components/organisms/LibraryContent";
import PlaylistContent from "../components/organisms/PlaylistContent";

type RenderingView = "library" | "playlist";

const IndexPage: FC = () => {
  const [renderingView, setRenderingView] = useState<RenderingView>("library");

  const onClickMenu = (value: "library" | "playlist" | "help") => {
    if (value === "help") {
      // do nothing
    } else {
      setRenderingView(value);
    }
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
        playerState={"playing"}
        duration={3}
        current={3}
        hasPrev={true}
        hasNext={true}
        onPlay={() => {}}
        onPause={() => {}}
        onNextTrack={() => {}}
        onPrevTrack={() => {}}
        onSlide={() => {}}
        onSlideFixed={() => {}}
      />
    </div>
  );
};

export default IndexPage;
