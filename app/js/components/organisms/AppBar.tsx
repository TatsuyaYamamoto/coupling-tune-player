import * as React from "react";
import styled from "styled-components";
import AutoBind from "autobind-decorator";

import MuiAppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";

import TitleTypography from "../atoms/TitleTypography";
import InfoButton from "../atoms/button/InfoIconButton";
import TweetButton from "../atoms/button/TweetButton";
import InfoDialog from "./InfoDialog";

import {goTo} from "../../utils";
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
        <MuiAppBar position="static" color="default">
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
    goTo(`${URL.TWITTER_TWEET_PAGE}?hashtags=おいものみきり+%23そこんところ工房&url=${URL.COUPLING_TUNE_PLAYER}`);

  }
}

export default AppBar;
