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

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProp<States>;

class AudioList extends React.Component<Props, ComponentState> {
  constructor(props: any) {
    super(props);

    this.onClickRow = this.onClickRow.bind(this);
  }

  public render() {
    const { audioList, playingIndex } = this.props;

    return (
      <React.Fragment>
        <TrackTable>
          <TrackTableHead />
          <TrackTableBody
            onRowClicked={this.onClickRow}
            list={audioList}
            playingIndex={playingIndex}
          />
        </TrackTable>
      </React.Fragment>
    );
  }

  private onClickRow(index: number) {
    console.log(`on row clicked. index: ${index}.`);
    const { dispatch, audioList, playing } = this.props;
    if (!dispatch) {
      return;
    }

    const left = audioList[index].left;
    const right = audioList[index].right;
    if (!left || !right) {
      console.log("Provided index item has no left or right audio.");
      return;
    }
    if (playing) {
      dispatch(pauseAudio());
    }
    dispatch(goIndex(index));
    dispatch(updateCurrentTime(0));
    dispatch(playAudio(left, right));
  }
}

interface StateProps {
  playing: boolean;
  audioList: AudioListItem[];
  playingIndex: number | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { list, playingIndex } = state.audiolist;
  const { playing } = state.player;
  return {
    playing,
    playingIndex,
    audioList: list
  };
}

export default connect(mapStateToProps)(AudioList) as React.ComponentClass<
  ComponentProps
>;
