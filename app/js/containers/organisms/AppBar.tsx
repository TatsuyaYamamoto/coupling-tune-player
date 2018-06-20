import * as React from "react";
import { default as styled } from "styled-components";
import { default as AutoBind } from "autobind-decorator";

import { AppBar as MuiAppBar, Toolbar } from "@material-ui/core";

import TitleTypography from "../../components/atoms/TitleTypography";
import InfoIconButton from "../../components/atoms/button/InfoIconButton";
import TweetButton from "../../components/atoms/button/TweetButton";
import InfoDialog from "../../components/molecules/InfoDialog";

import { sendEvent, tweetByWebIntent } from "../../utils";
import { URL } from "../../constants";

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

@AutoBind
class AppBar extends React.Component<ComponentProps, ComponentState> {
  public state = {
    isInfoDialogOpen: false
  };

  public render() {
    const { isInfoDialogOpen } = this.state;

    return (
      <Root>
        <MuiAppBar position="fixed">
          <Toolbar>
            <TitleTypography />

            <CenterSpace />
            <TweetButton onClick={this.onShowTweet} />
            <InfoIconButton onClick={this.onOpenInfoDialog} />
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
      value: "show_about_app"
    });
  }

  private onCloseInfoDialog() {
    this.setState({ isInfoDialogOpen: false });
  }

  private onShowTweet() {
    tweetByWebIntent({
      url: URL.COUPLING_TUNE_PLAYER,
      text: "かぷちゅうプレイヤー/Coupling Tune Player",
      hashtags: ["かぷちゅうプレイヤー", "そこんところ工房"]
    });

    sendEvent("click", {
      category: "info",
      value: "go_twitter_intent"
    });
  }
}

export default AppBar;
