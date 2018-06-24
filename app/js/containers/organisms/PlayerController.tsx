import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import { Card, CardContent } from "@material-ui/core";

import PlayTimeSlider from "../../components/molecules/PlayTimeSlider";
import TrackController from "../../components/molecules/TrackController";

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

export interface ComponentProps {}

export interface ComponentState {
  manualCurrentTime: number | null;
}

type Props = ComponentProps & DispatchProp<States> & StateProps;

const Buttons = styled(CardContent)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

@AutoBind
class PlayerController extends React.Component<Props, ComponentState> {
  public state = {
    manualCurrentTime: null
  };

  public render() {
    const {
      playerState,
      duration,
      current,
      leftAudio,
      rightAudio,
      hasPrev,
      hasNext,
      dispatch,
      ...others
    } = this.props;
    const { manualCurrentTime } = this.state;
    const currentTime = manualCurrentTime ? manualCurrentTime : current;

    return (
      <Card {...others}>
        <PlayTimeSlider
          min={0}
          max={duration}
          current={currentTime}
          onStartChange={this.onSliderStart}
          onChange={this.onSliderChange}
          onFixed={this.onSliderFixed}
        />
        <Buttons>
          <TrackController
            state={playerState}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPlayClick={this.onPlay}
            onPauseClick={this.onPause}
            onNextTrackClick={this.onNextClicked}
            onPrevTrackClick={this.onPrevClicked}
          />
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
