/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useState } from "react";
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
  onSlided: (newValue: number) => void;
}

export const PlayerController: FC<PlayerControllerProps> = (props) => {
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
    onSlided,
    ...others
  } = props;
  const [manualCurrentTime, setManualCurrentTime] = useState<number | null>(
    null
  );
  const currentTime = manualCurrentTime !== null ? manualCurrentTime : current;

  const handleSlide = (newValue: number) => {
    setManualCurrentTime(newValue);
  };

  const handleSlideFixed = (newValue: number) => {
    setManualCurrentTime(null);
    onSlided(newValue);
  };

  return (
    <Card {...others}>
      <PlayTimeSlider
        duration={duration}
        current={currentTime}
        onSlide={handleSlide}
        onSlideFixed={handleSlideFixed}
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
