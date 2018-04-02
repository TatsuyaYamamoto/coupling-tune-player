import * as React from "react";
import {Fragment} from "react";

import AppBar from "../organisms/AppBar";
import PlayerController from "../organisms/PlayerController";

class Index extends React.Component {
  public render() {
    return (
      <Fragment>
        <AppBar/>
        <PlayerController/>
      </Fragment>
    );
  }
}

export default Index;
