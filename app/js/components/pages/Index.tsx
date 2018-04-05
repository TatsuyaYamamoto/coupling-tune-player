import * as React from "react";
import {Fragment} from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import AppBar from "../organisms/AppBar";
import AudioInformation from "../organisms/AudioInformation";
import PlayerController from "../organisms/PlayerController";

const Controller = styled(PlayerController)`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

@AutoBind
class Index extends React.Component {
  public render() {
    return (
      <Fragment>
        <AppBar/>
        <AudioInformation/>
        <Controller/>
      </Fragment>
    );
  }
}

export default Index;
