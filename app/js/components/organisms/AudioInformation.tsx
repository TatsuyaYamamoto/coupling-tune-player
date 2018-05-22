import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import AutoBind from "autobind-decorator";

import { States } from "../../modules/redux";

import AudioDetail from "../molecules/AudioDetail";

import { AudioState, load as loadAudio } from "../../modules/player";
import { Dispatch } from "redux";
import LoadingDialog from "./dialog/LoadingDialog";
import { sendEvent } from "../../utils";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 10px;
`;

interface DetailProps {
  reverse?: boolean;
}

const Detail = styled(AudioDetail)`
  margin-top: ${(props: DetailProps) => (props.reverse ? "10px" : 0)};
  margin-bottom: ${(props: DetailProps) => (props.reverse ? 0 : "10px")};
`;

@AutoBind
class AudioInformation extends React.Component<
  ComponentProps & DispatchProps & StateProps,
  ComponentState
> {
  public render() {
    const { className, left, right, loading } = this.props;
    let leftTitle = null;
    let leftArtist = null;
    let leftImageSrc = null;
    if (left) {
      leftTitle = left.title;
      leftArtist = left.artist;
      leftImageSrc = left.pictureBase64;
    }

    let rightTitle = null;
    let rightArtist = null;
    let rightImageSrc = null;
    if (right) {
      rightTitle = right.title;
      rightArtist = right.artist;
      rightImageSrc = right.pictureBase64;
    }

    return (
      <Root className={className}>
        <Detail
          title={leftTitle}
          artist={leftArtist}
          imageSrc={leftImageSrc}
          onAudioSelected={this.onLeftAudioFileSelected}
        />
        <Detail
          reverse={true}
          title={rightTitle}
          artist={rightArtist}
          imageSrc={rightImageSrc}
          onAudioSelected={this.onRightAudioFileSelected}
        />

        <LoadingDialog open={loading} />
      </Root>
    );
  }

  private onLeftAudioFileSelected(file: File) {
    this.props.loadAudio(file, "left");

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "left"
    });
  }

  private onRightAudioFileSelected(file: File) {
    this.props.loadAudio(file, "right");

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "right"
    });
  }
}

interface StateProps {
  left: AudioState | null;
  right: AudioState | null;
  loading: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { left, right, loading } = state.player;

  return {
    left,
    right,
    loading
  };
}

interface DispatchProps {
  loadAudio: (file: File, type: "left" | "right") => void;
}

function mapDispatchToProps(
  dispatch: Dispatch<States>,
  ownProps: ComponentProps
): DispatchProps {
  return {
    loadAudio: (file: File, type: "left" | "right") => {
      dispatch(loadAudio(file, type));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AudioInformation
) as React.ComponentClass<ComponentProps>;
