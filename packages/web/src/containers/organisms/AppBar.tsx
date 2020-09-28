import * as React from "react";
import { connect } from "react-redux";

import styled from "styled-components";

import { AppBar as MuiAppBar, IconButton, Toolbar } from "@material-ui/core";

import TitleTypography from "../../components/atoms/TitleTypography";
import InfoDialog from "../../components/molecules/InfoDialog";
import TwitterLogoSvg from "../../components/atoms/icon/TwitterLogoSvg";
import InfoIcon from "../../components/atoms/icon/InfoIcon";

import {
  getLongestCommonSubstring,
  sendEvent,
  tweetByWebIntent,
} from "../../utils";
import { URL } from "../../constants";
import Song from "../../redux/model/Song";
import { States } from "../../redux/store";
import { findIdols } from "../../helper/idol/IdolUtil";
import { createCouplingName } from "../../helper/idol/Muse";

const Root = styled.div`
  display: flex;
`;

const CenterSpace = styled.div`
  flex: 1 1 auto;
`;

interface ComponentProps {}

interface ComponentState {
  isInfoDialogOpen: boolean;
}

type P = ComponentProps & StateProps;
type S = ComponentState;

class AppBar extends React.Component<P, S> {
  public state = {
    isInfoDialogOpen: false,
  };

  public render() {
    const { isInfoDialogOpen } = this.state;

    const title = (
      <TitleTypography>
        かぷちゅうプレイヤー/Coupling Tune Player
      </TitleTypography>
    );

    const tweetButton = (
      <IconButton onClick={this.onShowTweet}>
        <TwitterLogoSvg />
      </IconButton>
    );

    const infoButton = (
      <IconButton onClick={this.onOpenInfoDialog} color="inherit">
        <InfoIcon />
      </IconButton>
    );

    return (
      <Root>
        <MuiAppBar position="fixed">
          <Toolbar>
            {title}
            <CenterSpace />
            {tweetButton}
            {infoButton}
          </Toolbar>
        </MuiAppBar>

        <InfoDialog
          open={isInfoDialogOpen}
          handleClose={this.onCloseInfoDialog}
        />
      </Root>
    );
  }

  private onOpenInfoDialog() {
    this.setState({ isInfoDialogOpen: true });
    sendEvent("click", {
      category: "info",
      value: "show_about_app",
    });
  }

  private onCloseInfoDialog() {
    this.setState({ isInfoDialogOpen: false });
  }

  private onShowTweet() {
    const { left, right } = this.props;

    let text = "かぷちゅうプレイヤー/Coupling Tune Player\n\n";

    if (left && right) {
      const leftTitle = left.title;
      const leftArtist = left.artist;
      const rightTitle = right.title;
      const rightArtist = right.artist;

      if (leftArtist && rightArtist) {
        const leftIdol = findIdols(leftArtist)[0];
        const rightIdol = findIdols(rightArtist)[0];

        const title = getLongestCommonSubstring(leftTitle, rightTitle);
        const couplingName = createCouplingName(leftIdol, rightIdol);

        if (couplingName && title) {
          text = `「${couplingName}」で「${title}」をかぷ中〜♪\n\n`;
        }
      }
    }

    tweetByWebIntent({
      text,
      url: URL.COUPLING_TUNE_PLAYER,
      hashtags: ["かぷちゅうプレイヤー", "そこんところ工房"],
    });

    sendEvent("click", {
      category: "info",
      value: "go_twitter_intent",
    });
  }
}

interface StateProps {
  left: Song | null;
  right: Song | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { list, focusIndex, loading } = state.tracklist;
  const left = focusIndex ? list.get(focusIndex).left : null;
  const right = focusIndex ? list.get(focusIndex).right : null;

  return {
    left,
    right,
  };
}

export default connect(mapStateToProps)(AppBar);
