import * as React from "react";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import AppBar from "../organisms/AppBar";
import CurrentTrackView from "../organisms/CurrentTrackView";
import PlayerController from "../organisms/PlayerController";
import TrackTable from "../organisms/TrackTable";

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
          <CurrentTrackView />
          <TrackTable />
        </MainPanel>
        <Controller />
      </React.Fragment>
    );
  }
}

export default Index;
