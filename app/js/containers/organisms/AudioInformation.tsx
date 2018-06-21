import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { default as styled } from "styled-components";
import { default as AutoBind } from "autobind-decorator";

import { WithTheme, withTheme } from "@material-ui/core";
import { Audiotrack as AudiotrackIcon } from "@material-ui/icons";

import { States } from "../../redux/store";
import Track from "../../redux/model/Track";
import { select } from "../../redux/modules/audiolist";
import { toFiles } from "../../helper/FileSystem";

import CdSvg from "../../components/atoms/CdSvg";
import SelectableButton from "../../components/atoms/SelectableButton";
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

const Detail = styled.div`
  text-align: center;
`;

const CdCover = styled.div`
  width: 300px;
  height: 300px;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const StyledSelectableButton = styled(SelectableButton)`
  margin: 10px !important;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const NoImage = styled(CdSvg)`
  width: 100%;
  height: 100%;
`;

// TODO rename to.... JacketsArea?
@AutoBind
class AudioInformation extends React.Component<
  ComponentProps & DispatchProps & StateProps & WithTheme,
  ComponentState
> {
  public render() {
    const { className, left, right, loading, theme } = this.props;

    const leftImage = (
      <CdCover>
        {left && left.pictureBase64 ? (
          <Image src={left.pictureBase64} />
        ) : (
          <NoImage />
        )}
      </CdCover>
    );

    const rightImage = (
      <CdCover>
        {right && right.pictureBase64 ? (
          <Image src={right.pictureBase64} />
        ) : (
          <NoImage />
        )}
      </CdCover>
    );

    const leftFileButton = (
      <StyledSelectableButton
        accept="audio/*"
        multiple={true}
        onSelected={this.onLeftAudioFileSelected}
      >
        <AudiotrackIcon style={{ marginRight: theme.spacing.unit }} />
        <span>Left Track</span>
      </StyledSelectableButton>
    );

    const rightFileButton = (
      <StyledSelectableButton
        accept="audio/*"
        multiple={true}
        onSelected={this.onRightAudioFileSelected}
      >
        <span>Right Track</span>
        <AudiotrackIcon style={{ marginLeft: theme.spacing.unit }} />
      </StyledSelectableButton>
    );

    return (
      <Root className={className}>
        <Detail>
          {leftImage}
          {leftFileButton}
        </Detail>

        <Detail>
          {rightImage}
          {rightFileButton}
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
  withTheme()(AudioInformation)
) as React.ComponentClass<ComponentProps>;
