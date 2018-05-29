import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { default as styled } from "styled-components";
import { default as AutoBind } from "autobind-decorator";

import { States } from "../../modules/redux";
import Audio from "../../modules/model/Audio";

import AudioDetail from "../molecules/AudioDetail";
import LoadingDialog from "./dialog/LoadingDialog";

import { sendEvent } from "../../utils";
import { select } from "../../modules/audiolist";

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

  private onLeftAudioFileSelected(fileList: FileList) {
    this.props.selectLeftAudios(fileList);

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "left"
    });
  }

  private onRightAudioFileSelected(fileList: FileList) {
    this.props.selectRightAudios(fileList);

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "right"
    });
  }
}

interface StateProps {
  left: Audio | null;
  right: Audio | null;
  loading: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading } = state.player;

  return {
    loading,
    left: null,
    right: null
  };
}

interface DispatchProps {
  selectLeftAudios: (file: FileList) => void;
  selectRightAudios: (file: FileList) => void;
}

function mapDispatchToProps(
  dispatch: Dispatch<States>,
  ownProps: ComponentProps
): DispatchProps {
  return {
    selectLeftAudios: (files: FileList) => {
      dispatch(select(files, "left"));
    },
    selectRightAudios: (files: FileList) => {
      dispatch(select(files, "right"));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AudioInformation
) as React.ComponentClass<ComponentProps>;
