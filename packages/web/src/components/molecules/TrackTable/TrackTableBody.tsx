import React, { FC } from "react";
import { TableBody } from "@material-ui/core";

import NoTrackRow from "./NoTrackRow";
import TrackRow from "./TrackRow";

import TrackListIndex from "../../../redux/model/TrackListIndex";
import TrackList from "../../../redux/model/TrackList";

export interface ComponentProps {
  list: TrackList;
  focusIndex: TrackListIndex | null;
  onRowClicked: (index: number) => void;
  playerState: "unavailable" | "playing" | "pausing";
}

const TrackTable: FC<ComponentProps> = props => {
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

        const available = !!left && !!right;
        const selected = !!focusIndex && focusIndex.equals(index);
        const key = index + leftTitle + rightTitle;
        const onClick = () => onRowClicked(index);

        return (
          <TrackRow
            key={key}
            selected={selected}
            available={available}
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
