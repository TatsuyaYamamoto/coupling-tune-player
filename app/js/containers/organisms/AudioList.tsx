import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  default as TrackTable,
  TrackTableHead,
  TrackTableBody
} from "../../components/molecules/TrackTable";

import { States } from "../../redux/store";
import { goIndex } from "../../redux/modules/audiolist";
import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime
} from "../../redux/modules/player";
import Index from "../../redux/model/Index";
import TrackList from "../../redux/model/TrackList";

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProp<States>;

class AudioList extends React.Component<Props, ComponentState> {
  public render() {
    const { audioList, focusIndex, playerState } = this.props;

    return (
      <TrackTable
        onRowClicked={this.onClickRow}
        list={audioList}
        playerState={playerState}
        focusIndex={focusIndex}
      />
    );
  }

  private onClickRow = (index: number) => {
    console.log(`on row clicked. index: ${index}.`);
    const { dispatch, audioList, playerState } = this.props;
    if (!dispatch) {
      return;
    }
    const i = new Index(index);
    const left = audioList.get(i).left;
    const right = audioList.get(i).right;
    if (!left || !right) {
      console.log("Provided index item has no left or right audio.");
      return;
    }
    if (playerState === "playing") {
      dispatch(pauseAudio());
    }
    dispatch(goIndex(i));
    dispatch(updateCurrentTime(0));
    dispatch(playAudio(left, right));
  };
}

interface StateProps {
  playerState: "unavailable" | "playing" | "pausing";
  audioList: TrackList;
  focusIndex: Index | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading, playing, currentTime } = state.player;
  const { list, focusIndex } = state.audiolist;
  const leftAudio = focusIndex ? list.get(focusIndex).left : null;
  const rightAudio = focusIndex ? list.get(focusIndex).right : null;
  const ready = !!(leftAudio && rightAudio);
  const playerState =
    loading || !ready ? "unavailable" : playing ? "playing" : "pausing";

  return {
    playerState,
    focusIndex,
    audioList: list
  };
}

export default connect(mapStateToProps)(AudioList) as React.ComponentClass<
  ComponentProps
>;
