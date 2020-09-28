import React from "react";
import { TableRow, TableCell } from "@material-ui/core";

const NoTrackRow = () => (
  <TableRow>
    <TableCell padding={"none"} style={{ textAlign: "center" }} colSpan={3}>
      No track.
    </TableCell>
  </TableRow>
);

export default NoTrackRow;
