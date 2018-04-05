import * as React from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import AutoBind from "autobind-decorator";

import {States} from "../../modules/redux";

import AudioDetail from "../molecules/AudioDetail";

import {load as loadAudio} from "../../modules/player";
import {Dispatch} from "redux";
import Audio from "../../modules/helper/Audio";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {
}

const Root = styled.div`
  display: flex;
  flex-direction : column;
  justify-content: center;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 10px;
`;

@AutoBind
class AudioInformation extends React.Component<ComponentProps & DispatchProps & StateProps, ComponentState> {
  public render() {
    const {
      className,
      leftAudio,
      rightAudio,
    } = this.props;

    return (
      <Root className={className}>
        <AudioDetail
          audio={leftAudio}
          onAudioSelected={this.onLeftAudioFileSelected}
        />
        <AudioDetail
          reverse={true}
          audio={rightAudio}
          onAudioSelected={this.onRightAudioFileSelected}
        />
      </Root>
    );
  }

  private onLeftAudioFileSelected(file: File) {
    this.props.loadAudio(file, "left");
  }

  private onRightAudioFileSelected(file: File) {
    this.props.loadAudio(file, "right");
  }
}

interface StateProps {
  leftAudio: Audio | null;
  rightAudio: Audio | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const {leftAudio, rightAudio} = state.player;

  return {
    leftAudio,
    rightAudio,
  };
}

interface DispatchProps {
  loadAudio: (file: File, type: "left" | "right") => void;
}

function mapDispatchToProps(dispatch: Dispatch<States>, ownProps: ComponentProps): DispatchProps {
  return {
    loadAudio: (file: File, type: "left" | "right") => {
      dispatch(loadAudio(file, type));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AudioInformation) as React.ComponentClass<ComponentProps>;
