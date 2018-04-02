import * as React from "react";

import Card, {CardContent} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import SkipPreviousIcon from "material-ui-icons/SkipPrevious";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import SkipNextIcon from "material-ui-icons/SkipNext";

class PlayerController extends React.Component {
  public render() {
    return (
      <Card>
        <CardContent>
          <IconButton aria-label="Previous">
            <SkipPreviousIcon/>
          </IconButton>
          <IconButton aria-label="Play/pause">
            <PlayArrowIcon/>
          </IconButton>
          <IconButton aria-label="Next">
            <SkipNextIcon/>
          </IconButton>
        </CardContent>
      </Card>
    );
  }
}

export default PlayerController;
