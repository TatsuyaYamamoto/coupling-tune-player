import * as React from "react";
import {Fragment} from "react";

import CdCoverPicture from "../molecules/CdCoverImage";

class PlayerController extends React.Component {
  public render() {
    return (
      <Fragment>
        <CdCoverPicture/>
        <div>
          titles!
        </div>
        <CdCoverPicture/>
      </Fragment>
    );
  }
}

export default PlayerController;
