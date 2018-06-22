import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { default as styled } from "styled-components";
import { default as AutoBind } from "autobind-decorator";

import { Audiotrack as AudiotrackIcon } from "@material-ui/icons";

import { States } from "../../redux/store";
import Track from "../../redux/model/Track";
import { select } from "../../redux/modules/audiolist";

import CdCoverImage from "../../components/atoms/CdCoverImage";
import NoCdCoverImage from "../../components/atoms/NoCdCoverImage";
import LoadingDialog from "../../components/molecules/LoadingDialog";
import TrackSelectButton from "../../components/molecules/TrackSelectButton";

import { toFiles } from "../../helper/FileSystem";
import { sendEvent } from "../../utils";

export interface ComponentProps {}

export interface ComponentState {}

const Root = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 0;
`;

const Detail = styled.div`
  text-align: center;
`;

const StyledCdCoverImage = styled(CdCoverImage)`
  width: 300px;
  height: 300px;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const StyledNoCdCoverImage = styled(NoCdCoverImage)`
  width: 300px;
  height: 300px;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const StyledTrackSelectButton = styled(TrackSelectButton)`
  margin: 10px !important;
`;

type P = ComponentProps & DispatchProps & StateProps;
type S = ComponentState;

// TODO rename to.... JacketsArea?
@AutoBind
class AudioInformation extends React.Component<P, S> {
  public render() {
    const { left, right, loading, ...others } = this.props;

    const leftImage =
      left && left.pictureBase64 ? (
        <StyledCdCoverImage src={left.pictureBase64} />
      ) : (
        <StyledNoCdCoverImage />
      );

    const rightImage =
      right && right.pictureBase64 ? (
        <StyledCdCoverImage src={right.pictureBase64} />
      ) : (
        <StyledNoCdCoverImage />
      );

    return (
      <Root {...others}>
        <Detail>
          {leftImage}
          <StyledTrackSelectButton
            label="Left Track"
            leftIcon={<AudiotrackIcon />}
            onFileSelected={this.onLeftAudioFileSelected}
          />
        </Detail>

        <Detail>
          {rightImage}
          <StyledTrackSelectButton
            label="Right Track"
            rightIcon={<AudiotrackIcon />}
            onFileSelected={this.onRightAudioFileSelected}
          />
        </Detail>

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
