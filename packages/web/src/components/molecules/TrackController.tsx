import React, { FC } from "react";
import { Fab, IconButton } from "@material-ui/core";
import styled from "@emotion/styled";

import PLayTrackIcon from "../../components/atoms/icon/PLayTrackIcon";
import PauseTrackIcon from "../../components/atoms/icon/PauseTrackIcon";
import PrevTrackIcon from "../../components/atoms/icon/PrevTrackIcon";
import NextTrackIcon from "../../components/atoms/icon/NextTrackIcon";

const Root = styled.div``;

const StyledFab = styled(Fab)`
  && {
    margin: 10px;
  }
`;

interface TrackControllerProps {
  state: "playing" | "pausing" | "unavailable";
  hasPrev: boolean;
  hasNext: boolean;
  onPlayClick: () => void;
  onPauseClick: () => void;
  onNextTrackClick?: () => void;
  onPrevTrackClick?: () => void;
}

const TrackController: FC<TrackControllerProps> = (props) => {
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
    <StyledFab color="primary" onClick={onPlayClick}>
      <PLayTrackIcon />
    </StyledFab>
  );

  const unavailableButton = (
    <StyledFab color="primary" disabled={true}>
      <PLayTrackIcon />
    </StyledFab>
  );

  const pauseButton = (
    <StyledFab color="primary" onClick={onPauseClick}>
      <PauseTrackIcon />
    </StyledFab>
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

  const prevButton = onPrevTrackClick ? (
    <IconButton color="primary" disabled={!hasPrev} onClick={onPrevTrackClick}>
      <PrevTrackIcon />
    </IconButton>
  ) : null;

  const nextButton = onNextTrackClick ? (
    <IconButton color="primary" disabled={!hasNext} onClick={onNextTrackClick}>
      <NextTrackIcon />
    </IconButton>
  ) : null;

  return (
    <Root>
      {prevButton}
      {centerButton}
      {nextButton}
    </Root>
  );
};

export default TrackController;
