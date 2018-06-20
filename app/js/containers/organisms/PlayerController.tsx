import "rc-slider/assets/index.css";

import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import { Card, CardContent } from "@material-ui/core";

import PlayButton from "../../components/atoms/button/PlayButton";
import PauseButton from "../../components/atoms/button/PauseButton";
import PrevButton from "../../components/atoms/button/PrevButton";
import NextButton from "../../components/atoms/button/NextButton";
import PlayTimeSlider from "../../components/molecules/PlayTimeSlider";

import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime,
  skipPrevious,
  skipNext
} from "../../modules/player";
import { States } from "../../modules/redux";
import Track from "../../modules/model/Track";

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

const Play = styled(PlayButton)`
  && {
    margin: 10px;
  }
`;

const Pause = styled(PauseButton)`
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

    let centerButton = null;
    switch (playerState) {
      case "playing":
        centerButton = <Pause onClick={this.onPause} />;
        break;
      case "pausing":
        centerButton = <Play onClick={this.onPlay} />;
        break;
      case "unavailable":
      default:
        centerButton = <Play disabled={true} />;
        break;
    }

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
          <PrevButton disabled={!hasPrev} onClick={this.onPrevClicked} />
          {centerButton}
          <NextButton disabled={!hasNext} onClick={this.onNextClicked} />
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
