import * as React from "react";
import { Button, IconButton } from "@material-ui/core";
import { default as styled } from "styled-components";

import PLayTrackIcon from "../../components/atoms/icon/PLayTrackIcon";
import PauseTrackIcon from "../../components/atoms/icon/PauseTrackIcon";
import PrevTrackIcon from "../../components/atoms/icon/PrevTrackIcon";
import NextTrackIcon from "../../components/atoms/icon/NextTrackIcon";

const Root = styled.div``;

const StyledButton = styled(Button)`
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
  onNextTrackClick: () => void;
  onPrevTrackClick: () => void;
}

const TrackController: React.SFC<TrackControllerProps> = props => {
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
    <StyledButton variant="fab" color="primary" onClick={onPlayClick}>
      <PLayTrackIcon />
    </StyledButton>
  );

  const unavailableButton = (
    <StyledButton variant="fab" color="primary" disabled={true}>
      <PLayTrackIcon />
    </StyledButton>
  );

  const pauseButton = (
    <StyledButton variant="fab" color="primary" onClick={onPauseClick}>
      <PauseTrackIcon />
    </StyledButton>
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
    <Root>
      {prevButton}
      {centerButton}
      {nextButton}
    </Root>
  );
};

export default TrackController;
