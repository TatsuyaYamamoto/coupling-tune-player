import * as React from "react";

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "material-ui";
import { PlayArrow } from "material-ui-icons";

export interface ComponentState {}

export interface ComponentProps {
  className?: string;
}

type Props = ComponentProps;

class AudioList extends React.Component<Props, ComponentState> {
  public render() {
    const { className } = this.props;
    const audioList = [
      { track: 1, title: "title11111111111111111" },
      { track: 2, title: "title2" },
      { track: 3, title: "title3" }
    ];

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
              {audioList.map(row => (
                <TableRow key={row.title} hover={true}>
                  <TableCell padding={"none"} style={{ textAlign: "right" }}>
                    {row.title}
                  </TableCell>
                  <TableCell padding={"none"} style={{ textAlign: "center" }}>
                    <PlayArrow />
                  </TableCell>
                  <TableCell padding={"none"} style={{ textAlign: "left" }}>
                    {row.title}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default AudioList;
