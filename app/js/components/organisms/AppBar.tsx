import * as React from "react";

import MuiAppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";

class AppBar extends React.Component {
  public render() {
    return (
      <MuiAppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Coupling Tune Player
          </Typography>
        </Toolbar>
      </MuiAppBar>
    );
  }
}

export default AppBar;
