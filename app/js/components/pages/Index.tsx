import * as React from "react";
import {Fragment} from "react";
import AutoBind from "autobind-decorator";

import AppBar from "../organisms/AppBar";
import AudioInformation from "../organisms/AudioInformation";
import PlayerController from "../organisms/PlayerController";

import Audio from "../../modules/Audio";

@AutoBind
class Index extends React.Component {
  private leftAudio: Audio | null = null;
  private rightAudio: Audio | null = null;

  public render() {
    return (
      <Fragment>
        <AppBar/>
        <AudioInformation />
        <PlayerController/>
      </Fragment>
    );
  }
}

export default Index;
