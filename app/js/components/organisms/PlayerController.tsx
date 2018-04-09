import "rc-slider/assets/index.css";

import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import Card, {CardContent} from "material-ui/Card";

import SkipNextButton from "../atoms/button/SkipNextButton";
import SkipPreviousButton from "../atoms/button/SkipPreviousButton";
import PlayButton from "../atoms/button/PlayButton";
import PauseButton from "../atoms/button/PauseButton";

import {play as playAudio, pause as pauseAudio} from "../../modules/player";
import {States} from "../../modules/redux";

import PlayTimeSlider from "../molecules/PlayTimeSlider";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {
}

type Props = ComponentProps & DispatchProps & StateProps;

const Buttons = styled(CardContent)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Previous = styled(SkipPreviousButton)`
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

const Next = styled(SkipNextButton)`
`;

@AutoBind
class PlayerController extends React.Component<Props, ComponentState> {
  public state = {
    current: 0,
  };

  public render() {
    const {
      playing,
      ready,
      className,
      duration,
      current,
    } = this.props;
    console.log(`${current}/${duration}`);

    return (
      <Card className={className}>
        <PlayTimeSlider
          min={0}
          max={duration}
          current={current}
          onChange={this.onSliderChange}
          onFixed={this.onSliderFixed}
        />
        <Buttons>
          {playing ? <Pause onClick={this.onPause}/> : <Play disabled={!ready} onClick={this.onPlay}/>}
        </Buttons>
      </Card>
    );
  }

  private onPlay() {
    this.props.playAudio();
  }

  private onPause() {
    this.props.pauseAudio();
  }

  private onSliderChange(newValue: number) {
    // this.setState({current: newValue});
  }

  private onSliderFixed(newValue: number) {
  }
}

interface StateProps {
  playing: boolean;
  ready: boolean;
  duration: number;
  current: number;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const {
    playing,
    left,
    right,
    currentMillis,
  } = state.player;

  return {
    playing,
    ready: !!(left.buffer && right.buffer),
    duration: !!left.buffer ? left.buffer.duration * 1000 : 0,
    current: currentMillis || 0,
  };
}

interface DispatchProps {
  playAudio: () => void;
  pauseAudio: () => void;
}

function mapDispatchToProps(dispatch: Dispatch<States>, ownProps: ComponentProps): DispatchProps {
  return {
    playAudio: () => {
      dispatch(playAudio());
    },
    pauseAudio: () => {
      dispatch(pauseAudio());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerController) as React.ComponentClass<ComponentProps>;
