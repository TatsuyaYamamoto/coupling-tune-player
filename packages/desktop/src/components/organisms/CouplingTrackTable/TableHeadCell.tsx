/** @jsx jsx */
import React, { FC, HTMLAttributes } from "react";
import { jsx, css } from "@emotion/core";

import { TableCell as MuiTableCell } from "@material-ui/core";

export interface TableHeadCellProps extends HTMLAttributes<HTMLDivElement> {
  align?: "inherit" | "left" | "center" | "right" | "justify";
}

const TableHeadCell: FC<TableHeadCellProps> = (props) => {
  const { align, className, children } = props;

  return (
    <MuiTableCell align={align} className={className}>
      {children}
    </MuiTableCell>
  );
};

export default TableHeadCell;
