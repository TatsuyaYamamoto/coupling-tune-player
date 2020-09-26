/** @jsx jsx */
import React, { FC, useState, MouseEvent, HTMLAttributes } from "react";
import { jsx, css } from "@emotion/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  TableCell as MuiTableCell,
  TableSortLabel as MuiTableSortLabel,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

export interface SortableTableHeadCellProps
  extends HTMLAttributes<HTMLDivElement> {
  align?: "inherit" | "left" | "center" | "right" | "justify";
  direction?: "asc" | "desc";
  active: boolean;
  onClick: (e: MouseEvent) => void;
}

const SortableTableHeadCell: FC<SortableTableHeadCellProps> = (props) => {
  const { align, direction, active, onClick, children } = props;
  const classes = useStyles();

  return (
    <MuiTableCell align={align}>
      <MuiTableSortLabel
        active={active}
        direction={direction}
        onClick={onClick}
      >
        {children}
        {active ? (
          <span className={classes.visuallyHidden}>
            {direction === "desc" ? "sorted descending" : "sorted ascending"}
          </span>
        ) : null}
      </MuiTableSortLabel>
    </MuiTableCell>
  );
};

export default SortableTableHeadCell;
