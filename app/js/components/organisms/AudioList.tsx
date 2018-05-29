import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "material-ui";
import { PlayArrow } from "material-ui-icons";

import { States } from "../../modules/redux";
import { goIndex, AudioListItem } from "../../modules/audiolist";

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProp<States>;

class AudioList extends React.Component<Props, ComponentState> {
  public render() {
    const { className, audioList, playingIndex } = this.props;

    return (
      <div>
        <Paper className={className}>
          <Table>
            <TableHead>
              <TableRow style={{ verticalAlign: "middle" }}>
                <TableCell padding={"none"} style={{ textAlign: "right" }}>
                  Left title
                </TableCell>
                <TableCell
                  padding={"none"}
                  style={{ width: 100, textAlign: "center" }}
                >
                  Status
                </TableCell>
                <TableCell padding={"none"} style={{ textAlign: "left" }}>
                  Right title
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {audioList.map((listItem, index) => {
                const leftTitle = listItem.left ? listItem.left.title : "---";
                const rightTitle = listItem.right
                  ? listItem.right.title
                  : "---";
                const selected = playingIndex === index;
                const key = index + leftTitle + rightTitle;
                const onClick = () => this.onClickRow(index);

                return (
                  <TableRow
                    key={key}
                    hover={true}
                    selected={selected}
                    onClick={onClick}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell padding={"none"} style={{ textAlign: "right" }}>
                      {leftTitle}
                    </TableCell>
                    <TableCell padding={"none"} style={{ textAlign: "center" }}>
                      <PlayArrow />
                    </TableCell>
                    <TableCell padding={"none"} style={{ textAlign: "left" }}>
                      {rightTitle}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  private onClickRow(index: number) {
    console.log(`on row clicked. index: ${index}.`);
    const { dispatch } = this.props;

    dispatch && dispatch(goIndex(index));
  }
}

interface StateProps {
  audioList: AudioListItem[];
  playingIndex: number | null;
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { list, playingIndex } = state.audiolist;
  return {
    playingIndex,
    audioList: list
  };
}

export default connect(mapStateToProps)(AudioList) as React.ComponentClass<
  ComponentProps
>;
