import { NextPage } from "next";
import styled from "@emotion/styled";

import AppBar from "../src/components/organisms/AppBar";
import CurrentTrackView from "../src/components/organisms/CurrentTrackView";
import TrackTable from "../src/components/organisms/TrackTable";
import PlayerController from "../src/components/organisms/PlayerController";

const Controller = styled(PlayerController)`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const MainPanel = styled.div`
  margin: 50px 30px 200px;
`;

const WebPlayerPage: NextPage = () => {
  return (
    <>
      <AppBar />
      <MainPanel>
        <CurrentTrackView />
        <TrackTable />
      </MainPanel>
      <Controller />
    </>
  );
};
export default WebPlayerPage;
