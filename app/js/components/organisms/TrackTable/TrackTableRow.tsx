import * as React from "react";
import { TableRow, TableCell, TableBody } from "material-ui";
import { PlayArrow } from "material-ui-icons";

import withHover, { WithHoverProps } from "../../hoc/withHover";

const LeftTrack = ({ title, artist }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "right" }}>
    <span>
      {title} / {artist}
    </span>
  </TableCell>
);

const TrackNumber = ({ trackNumber }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "center" }}>
    <span>{trackNumber}</span>
  </TableCell>
);

const PlayTrack = () => (
  <TableCell padding={"none"} style={{ textAlign: "center" }}>
    <PlayArrow />
  </TableCell>
);

const RightTrack = ({ title, artist }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "left" }}>
    <span>
      {title} / {artist}
    </span>
  </TableCell>
);

interface TrackRowProps {
  trackNumber: number;
  leftTitle: string;
  leftArtist: string;
  rightTitle: string;
  rightArtist: string;
  selected: boolean;
  onClick: () => void;
}

const TrackTableRow = withHover<TrackRowProps>(props => {
  const {
    trackNumber,
    leftTitle,
    leftArtist,
    rightTitle,
    rightArtist,
    selected,
    onClick,
    hover,
    onMouseEnter,
    onMouseLeave
  } = props;

  return (
    <TableRow
      hover={true}
      selected={selected}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <LeftTrack title={leftTitle} artist={leftArtist} />
      {hover ? <PlayTrack /> : <TrackNumber trackNumber={trackNumber} />}
      <RightTrack title={rightTitle} artist={rightArtist} />
    </TableRow>
  );
});

export default TrackTableRow;
