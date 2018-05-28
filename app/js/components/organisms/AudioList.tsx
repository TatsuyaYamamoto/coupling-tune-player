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
    const { className, leftList } = this.props;
    console.log(leftList);

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
              {leftList.map(item => {
                return (
                  <TableRow key={item.name} hover={true}>
                    <TableCell padding={"none"} style={{ textAlign: "right" }}>
                      {item.name}
                    </TableCell>
                    <TableCell padding={"none"} style={{ textAlign: "center" }}>
                      <PlayArrow />
                    </TableCell>
                    <TableCell padding={"none"} style={{ textAlign: "left" }}>
                      {item.name}
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
  leftList: AudioItemState[];
  rightList: AudioItemState[];
}

function mapStateToProps(state: States, ownProps: ComponentProps): StateProps {
  const { left, right } = state.audiolist;
  return {
    leftList: left,
    rightList: right
  };
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
