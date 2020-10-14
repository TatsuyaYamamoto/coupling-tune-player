import React, { FC } from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";

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

const TrackTableHead: FC<ComponentProps> = (props) => {
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
