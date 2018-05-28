import * as React from "react";
import { connect, Dispatch } from "react-redux";

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
import { AudioItemState } from "../../modules/audiolist";

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps & StateProps & DispatchProps;

class AudioList extends React.Component<Props, ComponentState> {
  public render() {
    const { className, list } = this.props;

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
              {list.map(item => {
                const { left, right } = item;
                const leftTitle = left ? left.title : "";
                const rightTitle = right ? right.title : "";
                return (
                  <TableRow key={`${leftTitle}@${rightTitle}`} hover={true}>
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
}

interface StateProps {
  list: AudioItemState[];
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { list } = state.audiolist;
  return { list };
}

interface DispatchProps {}

function mapDispatchToProps(
  dispatch: Dispatch<States>,
  ownProps: ComponentProps
): DispatchProps {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AudioList
) as React.ComponentClass<ComponentProps>;
