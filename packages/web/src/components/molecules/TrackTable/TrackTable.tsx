import React, { FC } from "react";
import { Paper, Table, TableBody } from "@material-ui/core";

import TrackTableHead from "./TrackTableHead";
import NoTrackRow from "./NoTrackRow";
import TrackRow from "./TrackRow";

import TrackList from "../../../redux/model/TrackList";
import TrackListIndex from "../../../redux/model/TrackListIndex";

export interface ComponentProps {
  list: TrackList;
  focusIndex: TrackListIndex | null;
  onRowClicked: (index: number) => void;
  playerState: "unavailable" | "playing" | "pausing";
}

const TrackTable: FC<ComponentProps> = props => {
  const { list, focusIndex, onRowClicked, playerState, ...others } = props;

  const rows =
    list.size() === 0 ? (
      <NoTrackRow />
    ) : (
      list.value.map((listItem, index) => {
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
      })
    );

  return (
    <Paper {...others}>
      <Table style={{ tableLayout: "fixed" }}>
        <TrackTableHead />
        <TableBody>{rows}</TableBody>
      </Table>
    </Paper>
  );
};

export default TrackTable;
