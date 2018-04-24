import * as React from "react";
import styled from "styled-components";
import AutoBind from "autobind-decorator";

import MuiAppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";

import TitleTypography from "../atoms/TitleTypography";
import InfoButton from "../atoms/button/InfoIconButton";
import TweetButton from "../atoms/button/TweetButton";
import InfoDialog from "./dialog/InfoDialog";

import { tweetByWebIntent} from "../../utils";
import {URL} from "../../constants";

const Root = styled.div`
display: flex;
`;

const CenterSpace = styled.div`
flex: 1 1 auto;
`;

interface ComponentProps {

}

interface ComponentState {
  isInfoDialogOpen: boolean;
}

@AutoBind
class AppBar extends React.Component<ComponentProps, ComponentState> {
  public state = {
    isInfoDialogOpen: false,
  };

  public render() {
    const {isInfoDialogOpen} = this.state;

    return (
      <Root>
        <MuiAppBar position="static">
          <Toolbar>

            <TitleTypography/>

            <CenterSpace/>
            <TweetButton onClick={this.onShowTweet}/>
            <InfoButton onClick={this.onOpenInfoDialog}/>
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
    this.setState({isInfoDialogOpen: true});
  }

  private onCloseInfoDialog() {
    this.setState({isInfoDialogOpen: false});
  }

  private onShowTweet() {
    tweetByWebIntent({
      url: URL.COUPLING_TUNE_PLAYER,
      text: "かぷちゅうプレイヤー/Coupling Tune Player",
      hashtags: ["おいものみきり", "そこんところ工房"],
    });
  }
}

export default AppBar;
