import * as React from "react";
import { TableRow, TableCell } from "@material-ui/core";

import PLayTrackIcon from "../../atoms/icon/PLayTrackIcon";
import UnavailableIcon from "../../atoms/icon/UnavailableIcon";
import LoadingIcon from "../../atoms/icon/LoadingIcon";
import AudioWaveIcon from "../../atoms/icon/AudioWaveIcon";

import withHover from "../../../helper/hoc/withHover";

import Index from "../../../redux/model/Index";
import TrackList from "../../../redux/model/TrackList";

const NoTrackRow = () => (
  <TableRow>
    <TableCell padding={"none"} style={{ textAlign: "center" }} colSpan={3}>
      No track.
    </TableCell>
  </TableRow>
);

export default NoTrackRow;
