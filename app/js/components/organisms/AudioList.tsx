import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import TrackTable from "./table/TrackTable";
import TrackTableHead from "./table/TrackTableHead";
import TrackTableBody from "./table/TrackTableBody";

import { States } from "../../modules/redux";
import { goIndex, AudioListItem } from "../../modules/audiolist";
import {
  play as playAudio,
  pause as pauseAudio,
  updateCurrentTime
} from "../../modules/player";
import Index from "../../modules/model/Index";

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProp<States>;

class AudioList extends React.Component<Props, ComponentState> {
  public render() {
    const { audioList, focusIndex, playerState } = this.props;

    return (
      <React.Fragment>
        <TrackTable>
          <TrackTableHead />
          <TrackTableBody
            onRowClicked={this.onClickRow}
            list={audioList}
            playerState={playerState}
            focusIndex={focusIndex}
          />
        </TrackTable>
      </React.Fragment>
    );
  }

  private onClickRow = (index: number) => {
    console.log(`on row clicked. index: ${index}.`);
    const { dispatch, audioList, playerState } = this.props;
    if (!dispatch) {
      return;
    }

    const left = audioList[index].left;
    const right = audioList[index].right;
    if (!left || !right) {
      console.log("Provided index item has no left or right audio.");
      return;
    }
    if (playerState === "playing") {
      dispatch(pauseAudio());
    }
    dispatch(goIndex(new Index(index)));
    dispatch(updateCurrentTime(0));
    dispatch(playAudio(left, right));
  };
}

interface StateProps {
  playerState: "unavailable" | "playing" | "pausing";
  audioList: AudioListItem[];
  focusIndex: Index | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { loading, playing, currentTime } = state.player;
  const { list, focusIndex } = state.audiolist;
  const leftAudio = focusIndex ? list[focusIndex.value].left : null;
  const rightAudio = focusIndex ? list[focusIndex.value].right : null;
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
