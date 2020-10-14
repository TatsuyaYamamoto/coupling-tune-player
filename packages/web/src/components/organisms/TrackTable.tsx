import React, { FC } from "react";
import { connect, DispatchProp } from "react-redux";

import _TrackTable from "../molecules/TrackTable";

import { States } from "../../redux/store";
import { goIndex } from "../../redux/modules/tracklist";
import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime,
} from "../../redux/modules/player";
import TrackListIndex from "../../redux/model/TrackListIndex";
import TrackList from "../../redux/model/TrackList";

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProp<States>;

const TrackTable: FC<Props> = (props) => {
  const { trackList, focusIndex, playerState } = props;

  const onClickRow = (index: number) => {
    console.log(`on row clicked. index: ${index}.`);
    const { dispatch, trackList, playerState } = props;
    if (!dispatch) {
      return;
    }
    const i = new TrackListIndex(index);
    const left = trackList.getLeft(i);
    const right = trackList.getRight(i);
    if (!left || !right) {
      console.log("Provided index item has no left or right audio.");
      return;
    }
    if (playerState === "playing") {
      dispatch(pauseAudio() as any);
    }
    dispatch(goIndex(i) as any);
    // dispatch(updateCurrentTime(0) as any);
    dispatch(playAudio(left, right) as any);
  };

  return (
    <_TrackTable
      onRowClicked={onClickRow}
      list={trackList}
      playerState={playerState}
      focusIndex={focusIndex}
    />
  );
};

interface StateProps {
  playerState: "unavailable" | "playing" | "pausing";
  trackList: TrackList;
  focusIndex: TrackListIndex | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading, playing } = state.player;
  const { list, focusIndex } = state.tracklist;
  const left = focusIndex ? list.getLeft(focusIndex) : null;
  const right = focusIndex ? list.getRight(focusIndex) : null;
  const ready = !!(left && right);
  const playerState =
    loading || !ready ? "unavailable" : playing ? "playing" : "pausing";

  return {
    playerState,
    focusIndex,
    trackList: list,
  };
}

export default connect(mapStateToProps)(TrackTable);
