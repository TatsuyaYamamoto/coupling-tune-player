import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { default as styled } from "styled-components";
import { default as AutoBind } from "autobind-decorator";

import { States } from "../../redux/store";
import Track from "../../redux/model/Track";
import { select } from "../../redux/modules/audiolist";
import { toFiles } from "../../helper/FileSystem";

import AudioDetail from "../../components/molecules/AudioDetail";
import LoadingDialog from "../../components/molecules/LoadingDialog";

import { sendEvent } from "../../utils";

export interface ComponentProps {
  className?: string;
}

export interface ComponentState {}

const Root = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 0;
`;

const Detail = styled(AudioDetail)``;

// TODO rename to.... JacketsArea?
@AutoBind
class AudioInformation extends React.Component<
  ComponentProps & DispatchProps & StateProps,
  ComponentState
> {
  public render() {
    const { className, left, right, loading } = this.props;
    let leftImageSrc = null;
    if (left) {
      leftImageSrc = left.pictureBase64;
    }

    let rightImageSrc = null;
    if (right) {
      rightImageSrc = right.pictureBase64;
    }

    return (
      <Root className={className}>
        <Detail
          imageSrc={leftImageSrc}
          onAudioSelected={this.onLeftAudioFileSelected}
        />
        <Detail
          reverse={true}
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
  left: Track | null;
  right: Track | null;
  loading: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading } = state.audiolist;
  const { list, focusIndex } = state.audiolist;
  const left = focusIndex ? list.get(focusIndex).left : null;
  const right = focusIndex ? list.get(focusIndex).right : null;

  return {
    loading,
    left,
    right
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
    selectLeftAudios: (fileList: FileList) => {
      dispatch(select(toFiles(fileList), "left"));
    },
    selectRightAudios: (fileList: FileList) => {
      dispatch(select(toFiles(fileList), "right"));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AudioInformation
) as React.ComponentClass<ComponentProps>;
