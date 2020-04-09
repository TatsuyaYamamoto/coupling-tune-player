import * as React from "react";
import { TableRow, TableCell } from "@material-ui/core";

import PLayTrackIcon from "../../atoms/icon/PLayTrackIcon";
import UnavailableIcon from "../../atoms/icon/UnavailableIcon";
import LoadingIcon from "../../atoms/icon/LoadingIcon";
import AudioWaveIcon from "../../atoms/icon/AudioWaveIcon";

import withHover from "../../../helper/hoc/withHover";

interface TrackRowProps {
  trackNumber: number;
  leftTitle: string;
  leftArtist: string;
  rightTitle: string;
  rightArtist: string;
  selected: boolean;
  onClick: () => void;
  available: boolean;
  playerState: "unavailable" | "playing" | "pausing";
}

const TrackRow = withHover<TrackRowProps>(props => {
  const {
    trackNumber,
    leftTitle,
    leftArtist,
    rightTitle,
    rightArtist,
    selected,
    available,
    onClick,
    hover,
    onMouseEnter,
    onMouseLeave,
    playerState
  } = props;

  let statusIcon = null;
  if (selected) {
    switch (playerState) {
      case "playing":
        statusIcon = <AudioWaveIcon animation={true} />;
        break;
      case "pausing":
        statusIcon = <AudioWaveIcon animation={false} />;
        break;
      case "unavailable":
        statusIcon = <LoadingIcon animation={true} />;
        break;
    }
  } else {
    if (hover) {
      statusIcon = available ? <PLayTrackIcon /> : <UnavailableIcon />;
    } else {
      statusIcon = <span>{trackNumber}</span>;
    }
  }

  return (
    <TableRow
      hover={true}
      selected={selected}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <TableCell padding={"none"} style={{ textAlign: "right" }}>
        <span>
          {leftTitle} / {leftArtist}
        </span>
      </TableCell>

      <TableCell padding={"none"} style={{ textAlign: "center" }}>
        {statusIcon}
      </TableCell>

      <TableCell padding={"none"} style={{ textAlign: "left" }}>
        <span>
          {rightTitle} / {rightArtist}
        </span>
      </TableCell>
    </TableRow>
  );
});

export default TrackRow;
