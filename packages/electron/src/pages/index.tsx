/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useEffect } from "react";
import { PlayerController } from "@coupling-tune-player/share";

import useElectronMainProcess from "../components/hooks/useElectronMainProcess";

const IndexPage: FC = () => {
  const { openFileSelectDialog } = useElectronMainProcess();

  return (
    <div>
      <h1>React Electron App</h1>
      <p>Welcome to your Electron application.</p>
      <button onClick={() => openFileSelectDialog()}>open</button>
      <PlayerController
        css={css`
          position: fixed;
          bottom: 0;
          width: 100%;
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
