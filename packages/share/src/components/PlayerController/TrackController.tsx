/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC } from "react";
import { Fab, IconButton } from "@material-ui/core";
import {
  SkipNext as NextTrackIcon,
  Pause as PauseTrackIcon,
  PlayArrow as PlayTrackIcon,
  SkipPrevious as PrevTrackIcon
} from "@material-ui/icons";

interface TrackControllerProps {
  state: "playing" | "pausing" | "unavailable";
  hasPrev: boolean;
  hasNext: boolean;
  onPlayClick: () => void;
  onPauseClick: () => void;
  onNextTrackClick: () => void;
  onPrevTrackClick: () => void;
}

const TrackController: FC<TrackControllerProps> = props => {
  const {
    state,
    hasNext,
    hasPrev,
    onPauseClick,
    onPlayClick,
    onNextTrackClick,
    onPrevTrackClick,
    ...others
  } = props;

  const playButton = (
    <Fab
      css={css`
        && {
          margin: 10px;
        }
      `}
      color="primary"
      onClick={onPlayClick}
    >
      <PlayTrackIcon />
    </Fab>
  );

  const unavailableButton = (
    <Fab
      css={css`
        && {
          margin: 10px;
        }
      `}
      color="primary"
      disabled={true}
    >
      <PlayTrackIcon />
    </Fab>
  );

  const pauseButton = (
    <Fab
      css={css`
        && {
          margin: 10px;
        }
      `}
      color="primary"
      onClick={onPauseClick}
    >
      <PauseTrackIcon />
    </Fab>
  );

  const centerButton = (() => {
    switch (state) {
      case "playing":
        return pauseButton;
      case "pausing":
        return playButton;
      case "unavailable":
      default:
        return unavailableButton;
    }
  })();

  const prevButton = (
    <IconButton color="primary" disabled={!hasPrev} onClick={onPrevTrackClick}>
      <PrevTrackIcon />
    </IconButton>
  );

  const nextButton = (
    <IconButton color="primary" disabled={!hasNext} onClick={onNextTrackClick}>
      <NextTrackIcon />
    </IconButton>
  );

  return (
    <div>
      {prevButton}
      {centerButton}
      {nextButton}
    </div>
  );
};

export default TrackController;
