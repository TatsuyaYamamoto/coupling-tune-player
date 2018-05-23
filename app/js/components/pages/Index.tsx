import * as React from "react";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import AppBar from "../organisms/AppBar";
import AudioInformation from "../organisms/AudioInformation";
import PlayerController from "../organisms/PlayerController";

const Controller = styled(PlayerController)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const Info = styled(AudioInformation)`
  margin-bottom: 130px;
`;

@AutoBind
class Index extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <AppBar />
        <Info />
        <Controller />
      </React.Fragment>
    );
  }
}

export default Index;
