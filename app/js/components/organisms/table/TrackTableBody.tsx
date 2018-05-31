import * as React from "react";
import { TableRow, TableCell, TableBody } from "material-ui";
import { PlayArrow } from "material-ui-icons";

import withHover, { WithHoverProps } from "../../hoc/withHover";

import { AudioListItem } from "../../../modules/audiolist";

export interface ComponentProps {
  className?: string;
  list: AudioListItem[] | null;
  playingIndex: number | null;
  onRowClicked: (index: number) => void;
}

const NoTrackRow = () => (
  <TableRow>
    <TableCell padding={"none"} style={{ textAlign: "center" }} colSpan={3}>
      No track.
    </TableCell>
  </TableRow>
);

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

const TrackRow = withHover<TrackRowProps>(props => {
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

const TrackTable: React.SFC<ComponentProps> = props => {
  const { list, playingIndex, onRowClicked } = props;

  if (!list || list.length === 0) {
    return (
      <TableBody>
        <NoTrackRow />
      </TableBody>
    );
  }

  return (
    <TableBody>
      {list.map((listItem, index) => {
        const { left, right } = listItem;
        const leftTitle = left ? left.title : "---";
        const leftArtist = left && left.artist ? left.artist : "---";
        const rightTitle = right ? right.title : "---";
        const rightArtist = right && right.artist ? right.artist : "---";
        const trackNumber = index + 1;

        const selected = playingIndex === index;
        const key = index + leftTitle + rightTitle;
        const onClick = () => onRowClicked(index);

        return (
          <TrackRow
            key={key}
            selected={selected}
            onClick={onClick}
            trackNumber={trackNumber}
            leftTitle={leftTitle}
            leftArtist={leftArtist}
            rightTitle={rightTitle}
            rightArtist={rightArtist}
          />
        );
      })}
    </TableBody>
  );
};

export default TrackTable;
