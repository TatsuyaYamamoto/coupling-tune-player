import * as React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Typography
} from "material-ui";

export interface ComponentProps {
  className?: string;
}

const LeftCell = () => (
  <TableCell padding={"none"} style={{ textAlign: "right" }}>
    <span>Left</span>
  </TableCell>
);

const TrackNumberCell = () => (
  <TableCell padding={"none"} style={{ width: 100, textAlign: "center" }}>
    <span>No.</span>
  </TableCell>
);

const RightCell = () => (
  <TableCell padding={"none"} style={{ textAlign: "left" }}>
    <span>Right</span>
  </TableCell>
);

const TrackTableHead: React.SFC<ComponentProps> = props => {
  return (
    <TableHead>
      <TableRow style={{ verticalAlign: "middle" }}>
        <LeftCell />
        <TrackNumberCell />
        <RightCell />
      </TableRow>
    </TableHead>
  );
};

export default TrackTableHead;
