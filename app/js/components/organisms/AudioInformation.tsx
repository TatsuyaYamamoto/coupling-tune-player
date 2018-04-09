import * as React from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import AutoBind from "autobind-decorator";

import {States} from "../../modules/redux";

import AudioDetail from "../molecules/AudioDetail";

import {load as loadAudio} from "../../modules/player";
import {Dispatch} from "redux";

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

interface DetailProps {
  reverse?: boolean;
}

const Detail = styled(AudioDetail)`
  margin-top: ${(props: DetailProps) => props.reverse ? "10px" : 0};
  margin-bottom: ${(props: DetailProps) => props.reverse ? 0 : "10px"};
`;

@AutoBind
class AudioInformation extends React.Component<ComponentProps & DispatchProps & StateProps, ComponentState> {
  public render() {
    const {
      className,
      left,
      right,
    } = this.props;

    return (
      <Root className={className}>
        <Detail
          title={left.title}
          artist={left.artist}
          imageSrc={left.imageSrc}
          onAudioSelected={this.onLeftAudioFileSelected}
        />
        <Detail
          reverse={true}
          title={right.title}
          artist={right.artist}
          imageSrc={right.imageSrc}
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
  left: {
    title: string | null,
    artist: string | null,
    imageSrc: string | null,
  };
  right: {
    title: string | null,
    artist: string | null,
    imageSrc: string | null,
  };
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const {left, right} = state.player;

  return {
    left: {
      title: left.tag.title,
      artist: left.tag.artist,
      imageSrc: left.tag.pictureBase64,
    },
    right: {
      title: right.tag.title,
      artist: right.tag.artist,
      imageSrc: right.tag.pictureBase64,
    },
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
