import React, { FC, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import styled from "@emotion/styled";

import { AppBar as MuiAppBar, IconButton, Toolbar } from "@material-ui/core";

import InfoDialog from "../molecules/InfoDialog";
import TwitterLogoSvg from "../atoms/icon/TwitterLogoSvg";
import {
  InfoOutlined as InfoIcon,
  NavigateBefore as BackIcon,
  HelpOutline as HelpIcon,
} from "@material-ui/icons";

import { getLongestCommonSubstring, tweetByWebIntent } from "../../utils";
import { sendEvent } from "../../helper/gtag";
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

const AppBar: FC<P> = (props) => {
  const { left, right } = props;

  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);

  const onOpenInfoDialog = () => {
    setInfoDialogOpen(true);

    sendEvent("click", {
      category: "info",
      value: "show_about_app",
    });
  };

  const onCloseInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  const onShowTweet = () => {
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
  };

  return (
    <Root>
      <MuiAppBar position="fixed">
        <Toolbar>
          <Link href={`/`} passHref>
            <IconButton>
              <BackIcon />
            </IconButton>
          </Link>
          <CenterSpace />
          <IconButton onClick={onShowTweet}>
            <TwitterLogoSvg />
          </IconButton>
          <Link href={`/help`}>
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onOpenInfoDialog} color="inherit">
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>

      <InfoDialog open={isInfoDialogOpen} handleClose={onCloseInfoDialog} />
    </Root>
  );
};

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
