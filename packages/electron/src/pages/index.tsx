/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useEffect } from "react";
import { PlayerController } from "@coupling-tune-player/share";

import useElectronMainProcess from "../components/hooks/useElectronMainProcess";
import Drawer from "../components/organisms/Drawer";

const IndexPage: FC = () => {
  const { openFileSelectDialog } = useElectronMainProcess();

  const onClickMenu = () => {};

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
          <h1>React Electron App</h1>
          <p>Welcome to your Electron application.</p>
          <button onClick={() => openFileSelectDialog()}>open</button>
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
