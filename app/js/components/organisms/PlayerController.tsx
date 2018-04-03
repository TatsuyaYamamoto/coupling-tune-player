import * as React from "react";
import {connect} from "react-redux";

import AutoBind from "autobind-decorator";

import Card, {CardContent} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import SkipPreviousIcon from "material-ui-icons/SkipPrevious";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import SkipNextIcon from "material-ui-icons/SkipNext";
import {Dispatch} from "redux";
import {play as playAudio} from "../../modules/player";
import {States} from "../../modules/redux";

export interface ComponentProps {
}

export interface ComponentState {
}

@AutoBind
class PlayerController extends React.Component<ComponentProps & DispatchProps & StateProps, ComponentState> {
  public render() {
    return (
      <Card>
        <CardContent>
          <IconButton aria-label="Previous">
            <SkipPreviousIcon/>
          </IconButton>
          <IconButton
            aria-label="Play/pause"
            onClick={this.onPlay}
          >
            <PlayArrowIcon/>
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
}

interface StateProps {
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  return {};
}

interface DispatchProps {
  playAudio: () => void;
}

function mapDispatchToProps(dispatch: Dispatch<States>, ownProps: ComponentProps): DispatchProps {
  return {
    playAudio: () => {
      dispatch(playAudio());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerController) as React.ComponentClass<ComponentProps>;
