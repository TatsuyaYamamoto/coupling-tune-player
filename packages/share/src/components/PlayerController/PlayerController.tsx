/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC } from "react";
import { Card, CardContent } from "@material-ui/core";

import PlayTimeSlider from "./PlayTimeSlider";
import TrackController from "./TrackController";

export interface PlayerControllerProps {
  playerState: "playing" | "pausing" | "unavailable";
  duration: number;
  current: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSlide: (newValue: number) => void;
  onSlideFixed: (newValue: number) => void;
}

export const PlayerController: FC<PlayerControllerProps> = props => {
  const {
    playerState,
    duration,
    current,
    hasPrev,
    hasNext,
    onPlay,
    onPause,
    onNextTrack,
    onPrevTrack,
    onSlide,
    onSlideFixed,
    ...others
  } = props;

  return (
    <Card {...others}>
      <PlayTimeSlider
        min={0}
        max={duration}
        current={current}
        onSlide={onSlide}
        onSlideFixed={onSlideFixed}
      />
      <CardContent
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <TrackController
          state={playerState}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPlayClick={onPlay}
          onPauseClick={onPause}
          onNextTrackClick={onNextTrack}
          onPrevTrackClick={onPrevTrack}
        />
      </CardContent>
    </Card>
  );
};
