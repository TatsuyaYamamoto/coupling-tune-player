import * as React from "react";
import {Fragment} from "react";
import {connect} from "react-redux";

import AutoBind from "autobind-decorator";

import {States} from "../../modules/redux";

import CdCoverPicture from "../molecules/CdCoverImage";
import FileAttacheButton from "../atoms/FileAttacheButton";
import {load as loadAudio} from "../../modules/player";
import {Dispatch} from "redux";
import Audio from "../../modules/helper/Audio";

export interface ComponentProps {
}

export interface ComponentState {
}

@AutoBind
class AudioInformation extends React.Component<ComponentProps & DispatchProps & StateProps, ComponentState> {
  public render() {
    const {leftAudio, rightAudio} = this.props;

    return (
      <Fragment>
        <CdCoverPicture src={leftAudio && leftAudio.pictureBase64}/>
        <FileAttacheButton onSelected={this.onLeftAudioFileSelected}/>
        <div>
          Left
          {leftAudio && leftAudio.title}
          {leftAudio && leftAudio.artist}
        </div>
        <div>
          Right
          {rightAudio && rightAudio.title}
          {rightAudio && rightAudio.artist}
        </div>
        <CdCoverPicture src={rightAudio && rightAudio.pictureBase64}/>
        <FileAttacheButton onSelected={this.onRightAudioFileSelected}/>
      </Fragment>
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
