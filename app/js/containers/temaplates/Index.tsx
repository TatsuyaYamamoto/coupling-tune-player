import * as React from "react";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import AppBar from "../organisms/AppBar";
import AudioInformation from "../organisms/AudioInformation";
import PlayerController from "../organisms/PlayerController";
import AudioList from "../organisms/AudioList";

const Controller = styled(PlayerController)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const MainPanel = styled.div`
  margin: 50px 30px 200px;
`;

@AutoBind
class Index extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <AppBar />
        <MainPanel>
          <AudioInformation />
          <AudioList />
        </MainPanel>
        <Controller />
      </React.Fragment>
    );
  }
}

export default Index;
