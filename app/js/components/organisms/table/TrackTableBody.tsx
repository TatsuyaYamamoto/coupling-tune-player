import * as React from "react";
import { TableRow, TableCell, TableBody } from "material-ui";
import { PlayArrow, VolumeUp, VolumeMute, Refresh } from "material-ui-icons";

import withHover, { WithHoverProps } from "../../hoc/withHover";

import Index from "../../../modules/model/Index";
import TrackList from "../../../modules/model/TrackList";

export interface ComponentProps {
  className?: string;
  list: TrackList;
  focusIndex: Index | null;
  onRowClicked: (index: number) => void;
  playerState: "unavailable" | "playing" | "pausing";
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
        statusIcon = <VolumeUp />;
        break;
      case "pausing":
        statusIcon = <VolumeMute />;
        break;
      case "unavailable":
        statusIcon = <Refresh />;
        break;
    }
  } else {
    statusIcon = hover ? <PlayArrow /> : <span>{trackNumber}</span>;
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
      <LeftTrack title={leftTitle} artist={leftArtist} />
      <TableCell padding={"none"} style={{ textAlign: "center" }}>
        {statusIcon}
      </TableCell>
      <RightTrack title={rightTitle} artist={rightArtist} />
    </TableRow>
  );
});

const TrackTable: React.SFC<ComponentProps> = props => {
  const { list, focusIndex, onRowClicked, playerState } = props;

  if (list.size() === 0) {
    return (
      <TableBody>
        <NoTrackRow />
      </TableBody>
    );
  }

  return (
    <TableBody>
      {list.value.map((listItem, index) => {
        const { left, right } = listItem;
        const leftTitle = left ? left.title : "---";
        const leftArtist = left && left.artist ? left.artist : "---";
        const rightTitle = right ? right.title : "---";
        const rightArtist = right && right.artist ? right.artist : "---";
        const trackNumber = index + 1;

        const selected = !!focusIndex && focusIndex.equals(index);
        const key = index + leftTitle + rightTitle;
        const onClick = () => onRowClicked(index);

        return (
          <TrackRow
            key={key}
            selected={selected}
            playerState={playerState}
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
