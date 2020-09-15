/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC } from "react";
import { PlayerController } from "@coupling-tune-player/share";

const IndexPage: FC = () => {
  return (
    <div>
      <h1>React Electron App</h1>
      <p>Welcome to your Electron application.</p>
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
