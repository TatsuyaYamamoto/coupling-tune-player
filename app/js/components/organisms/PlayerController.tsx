import "rc-slider/assets/index.css";

import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import Card, { CardContent } from "material-ui/Card";

import PlayButton from "../atoms/button/PlayButton";
import PauseButton from "../atoms/button/PauseButton";
import PrevButton from "../atoms/button/PrevButton";
import NextButton from "../atoms/button/NextButton";

import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime
} from "../../modules/player";
import { States } from "../../modules/redux";

import PlayTimeSlider from "../molecules/PlayTimeSlider";
import { sendEvent } from "../../utils";
import Audio from "../../modules/model/Audio";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {
  manualCurrentTime: number | null;
}

type Props = ComponentProps & DispatchProps & StateProps;

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
    const { playing, ready, className, duration, current } = this.props;
    const { manualCurrentTime } = this.state;

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
          <PrevButton disabled={!ready} onClick={this.onPrevClicked} />
          {playing ? (
            <Pause onClick={this.onPause} />
          ) : (
            <Play disabled={!ready} onClick={this.onPlay} />
          )}
          <NextButton disabled={!ready} onClick={this.onNextClicked} />
        </Buttons>
      </Card>
    );
  }

  private onPlay() {
    const { leftAudio, rightAudio } = this.props;
    if (!leftAudio || !rightAudio) {
      return;
    }

    this.props.playAudio(leftAudio, rightAudio);

    sendEvent("click", {
      category: "player",
      label: "play"
    });
  }

  private onPause() {
    this.props.pauseAudio();
    sendEvent("click", {
      category: "player",
      label: "pause"
    });
  }

  private onPrevClicked() {
    console.log("on prev skip button clicked.");
  }

  private onNextClicked() {
    console.log("on next skip button clicked.");
  }

  private onSliderStart() {
    const { current } = this.props;
    this.setState({ manualCurrentTime: current });
  }

  private onSliderChange(newValue: number) {
    this.setState({ manualCurrentTime: newValue });
  }

  private async onSliderFixed(newValue: number) {
    const { leftAudio, rightAudio } = this.props;
    if (!leftAudio || !rightAudio) {
      return;
    }

    this.setState({ manualCurrentTime: null });
    const stopOnce = this.props.playing;

    if (stopOnce) {
      await this.props.pauseAudio();
    }

    await this.props.updateCurrentTime(newValue);

    if (stopOnce) {
      await this.props.playAudio(leftAudio, rightAudio);
    }

    sendEvent("click", {
      category: "player",
      label: "slider"
    });
  }
}

interface StateProps {
  playing: boolean;
  ready: boolean;
  duration: number;
  current: number;
  leftAudio: Audio | null;
  rightAudio: Audio | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { playing, currentTime } = state.player;
  const { list } = state.audiolist;
  const leftAudio = list[0] && list[0].left;
  const rightAudio = list[0] && list[0].right;

  return {
    playing,
    leftAudio,
    rightAudio,
    ready: !!(leftAudio && rightAudio),
    duration: !!leftAudio ? leftAudio.audioBuffer.duration : 0,
    current: currentTime || 0
  };
}

interface DispatchProps {
  playAudio: (left: Audio, right: Audio) => Promise<void>;
  pauseAudio: () => Promise<void>;
  updateCurrentTime: (time?: number) => Promise<void>;
}

function mapDispatchToProps(
  dispatch: Dispatch<States>,
  ownProps: ComponentProps
): DispatchProps {
  return {
    playAudio: (left: Audio, right: Audio) => dispatch(playAudio(left, right)),
    pauseAudio: () => dispatch(pauseAudio()),
    updateCurrentTime: (time?: number) => dispatch(updateCurrentTime(time))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  PlayerController
) as React.ComponentClass<ComponentProps>;
