import "rc-slider/assets/index.css";

import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import { Button, Card, CardContent, IconButton } from "@material-ui/core";

import PLayTrackIcon from "../../components/atoms/icon/PLayTrackIcon";
import PrevTrackIcon from "../../components/atoms/icon/PrevTrackIcon";
import NextTrackIcon from "../../components/atoms/icon/NextTrackIcon";
import PlayTimeSlider from "../../components/molecules/PlayTimeSlider";

import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime,
  skipPrevious,
  skipNext
} from "../../redux/modules/player";
import { States } from "../../redux/store";
import Track from "../../redux/model/Track";

import { sendEvent } from "../../utils";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {
  manualCurrentTime: number | null;
}

type Props = ComponentProps & DispatchProp<States> & StateProps;

const Buttons = styled(CardContent)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterButton = styled(Button)`
  && {
    margin: 10px;
  }
`;

@AutoBind
class PlayerController extends React.Component<Props, ComponentState> {
  public state = {
    manualCurrentTime: null
  };

  public render() {
    const {
      playerState,
      className,
      duration,
      current,
      hasPrev,
      hasNext
    } = this.props;
    const { manualCurrentTime } = this.state;

    const playButton = (
      <CenterButton variant="fab" color="primary" onClick={this.onPlay}>
        <PLayTrackIcon />
      </CenterButton>
    );

    const unavailableButton = (
      <CenterButton variant="fab" color="primary" disabled={true}>
        <PLayTrackIcon />
      </CenterButton>
    );

    const pauseButton = (
      <CenterButton variant="fab" color="primary" onClick={this.onPause}>
        <PLayTrackIcon />
      </CenterButton>
    );

    const centerButton = (() => {
      switch (playerState) {
        case "playing":
          return playButton;
        case "pausing":
          return pauseButton;
        case "unavailable":
        default:
          return unavailableButton;
      }
    })();

    const prevButton = (
      <IconButton
        color="primary"
        disabled={!hasPrev}
        onClick={this.onPrevClicked}
      >
        <PrevTrackIcon />
      </IconButton>
    );

    const nextButton = (
      <IconButton
        color="primary"
        disabled={!hasNext}
        onClick={this.onNextClicked}
      >
        <NextTrackIcon />
      </IconButton>
    );

    return (
      <Card className={className}>
        <PlayTimeSlider
          min={0}
          max={duration}
          current={manualCurrentTime ? manualCurrentTime : current}
          onStartChange={this.onSliderStart}
          onChange={this.onSliderChange}
          onFixed={this.onSliderFixed}
        />
        <Buttons>
          {prevButton}
          {centerButton}
          {nextButton}
        </Buttons>
      </Card>
    );
  }

  private onPlay() {
    const { leftAudio, rightAudio, dispatch } = this.props;
    if (!leftAudio || !rightAudio || !dispatch) {
      return;
    }

    dispatch(playAudio(leftAudio, rightAudio));

    sendEvent("click", {
      category: "player",
      label: "play"
    });
  }

  private onPause() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch(pauseAudio());
    sendEvent("click", {
      category: "player",
      label: "pause"
    });
  }

  private onPrevClicked() {
    console.log("on prev skip button clicked.");
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch(skipPrevious());
  }

  private onNextClicked() {
    console.log("on next skip button clicked.");
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch(skipNext());
  }

  private onSliderStart() {
    const { current } = this.props;
    this.setState({ manualCurrentTime: current });
  }

  private onSliderChange(newValue: number) {
    this.setState({ manualCurrentTime: newValue });
  }

  private async onSliderFixed(newValue: number) {
    const { leftAudio, rightAudio, dispatch } = this.props;
    if (!leftAudio || !rightAudio || !dispatch) {
      return;
    }

    this.setState({ manualCurrentTime: null });
    const stopOnce = this.props.playerState === "playing";

    if (stopOnce) {
      dispatch(pauseAudio());
    }

    dispatch(updateCurrentTime(newValue));

    if (stopOnce) {
      dispatch(playAudio(leftAudio, rightAudio));
    }

    sendEvent("click", {
      category: "player",
      label: "slider"
    });
  }
}

interface StateProps {
  playerState: "unavailable" | "playing" | "pausing";
  duration: number;
  current: number;
  leftAudio: Track | null;
  rightAudio: Track | null;
  hasPrev: boolean;
  hasNext: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading, playing, currentTime, duration } = state.player;
  const { list, focusIndex, prevIndex, nextIndex } = state.audiolist;
  const leftAudio = focusIndex ? list.get(focusIndex).left : null;
  const rightAudio = focusIndex ? list.get(focusIndex).right : null;
  const ready = !!(leftAudio && rightAudio);
  const playerState =
    loading || !ready ? "unavailable" : playing ? "playing" : "pausing";
  const hasPrev = prevIndex !== null;
  const hasNext = nextIndex !== null;

  return {
    playerState,
    leftAudio,
    rightAudio,
    hasPrev,
    hasNext,
    duration,
    current: currentTime || 0
  };
}

export default connect(mapStateToProps)(
  PlayerController
) as React.ComponentClass<ComponentProps>;
