import * as React from "react";
import { Paper, Table } from "@material-ui/core";

export interface ComponentProps {
  className?: string;
}

const TrackTable: React.SFC<ComponentProps> = props => {
  const { children, className } = props;
  return (
    <Paper className={className}>
      <Table style={{ tableLayout: "fixed" }}>{children}</Table>
    </Paper>
  );
};

export default TrackTable;
