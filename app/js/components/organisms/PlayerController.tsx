import * as React from "react";
import {connect} from "react-redux";

import AutoBind from "autobind-decorator";

import Card, {CardContent} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import SkipPreviousIcon from "material-ui-icons/SkipPrevious";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import PauseIcon from "material-ui-icons/Pause";
import SkipNextIcon from "material-ui-icons/SkipNext";
import {Dispatch} from "redux";
import {play as playAudio, pause as pauseAudio} from "../../modules/player";
import {States} from "../../modules/redux";

export interface ComponentProps {
}

export interface ComponentState {
}

@AutoBind
class PlayerController extends React.Component<ComponentProps & DispatchProps & StateProps, ComponentState> {
  public render() {
    const {playing} = this.props;
    return (
      <Card>
        <CardContent>
          <IconButton aria-label="Previous">
            <SkipPreviousIcon/>
          </IconButton>
          <IconButton aria-label="Play/pause">
            {
              playing ?
                <PauseIcon onClick={this.onPause}/> :
                <PlayArrowIcon onClick={this.onPlay}/>
            }
          </IconButton>
          <IconButton aria-label="Next">
            <SkipNextIcon/>
          </IconButton>
        </CardContent>
      </Card>
    );
  }

  private onPlay() {
    this.props.playAudio();
  }

  private onPause() {
    this.props.pauseAudio();
  }
}

interface StateProps {
  playing: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const {playing} = state.player;
  return {
    playing,
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
