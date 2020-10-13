import React, { FC } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import { Audiotrack as AudiotrackIcon } from "@material-ui/icons";

import { States } from "../../redux/store";
import Song from "../../redux/model/Song";
import { select } from "../../redux/modules/tracklist";

import CdCoverImage from "../atoms/CdCoverImage";
import NoCdCoverImage from "../atoms/NoCdCoverImage";
import LoadingDialog from "../molecules/LoadingDialog";
import TrackSelectButton from "../molecules/TrackSelectButton";

import { toFiles } from "../../helper/FileSystem";
import { sendEvent } from "../../utils";

const Root = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 0;
`;

const LeftArea = styled.div`
  text-align: center;
`;

const RightArea = styled.div`
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

export interface ComponentProps {}

export interface ComponentState {}

type P = ComponentProps & DispatchProps & StateProps;
type S = ComponentState;

const CurrentTrackView: FC<P> = (props) => {
  const {
    left,
    right,
    loading,
    selectLeftAudios,
    selectRightAudios,
    ...others
  } = props;

  const onLeftAudioFileSelected = (fileList: FileList) => {
    selectLeftAudios(fileList);

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "left",
    });
  };

  const onRightAudioFileSelected = (fileList: FileList) => {
    selectRightAudios(fileList);

    sendEvent("click", {
      category: "player",
      label: "select_audio",
      value: "right",
    });
  };

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
      <LeftArea>
        {leftImage}
        <StyledTrackSelectButton
          label="Left Track"
          leftIcon={<AudiotrackIcon />}
          onFileSelected={onLeftAudioFileSelected}
        />
      </LeftArea>

      <RightArea>
        {rightImage}
        <StyledTrackSelectButton
          label="Right Track"
          rightIcon={<AudiotrackIcon />}
          onFileSelected={onRightAudioFileSelected}
        />
      </RightArea>

      <LoadingDialog open={loading} />
    </Root>
  );
};

interface StateProps {
  left: Song | null;
  right: Song | null;
  loading: boolean;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { list, focusIndex, loading } = state.tracklist;
  const left = focusIndex ? list.get(focusIndex).left : null;
  const right = focusIndex ? list.get(focusIndex).right : null;

  return {
    loading,
    left,
    right,
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
      dispatch(select(toFiles(fileList), "left") as any);
    },
    selectRightAudios: (fileList: FileList) => {
      dispatch(select(toFiles(fileList), "right") as any);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentTrackView);
