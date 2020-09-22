/** @jsx jsx */
import React, { FC, useState, MouseEvent } from "react";
import { jsx, css } from "@emotion/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableHead as MuiTableHead,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  TableSortLabel as MuiTableSortLabel,
  Paper,
} from "@material-ui/core";
import { TableCellProps } from "@material-ui/core/TableCell/TableCell";

import { CouplingTrack } from "../../models/CouplingTrack";
import { getComparator, stableSort } from "../../utils/calc";
import NoArtwork from "../atoms/NoArtwork";

type OrderType = "asc" | "desc";

type TableFieldId =
  | keyof Pick<CouplingTrack, "title" | "durationString" | "playCount">
  | "vocals";

interface HeadCell {
  id: TableFieldId;
  label: string;
  align: TableCellProps["align"];
  sortable: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "title",
    label: "Title",
    align: "left",
    sortable: true,
  },
  {
    id: "durationString",
    label: "Duration",
    align: "right",
    sortable: false,
  },
  { id: "vocals", label: "Vocals", align: "left", sortable: false },
  {
    id: "playCount",
    label: "Play Count",
    align: "left",
    sortable: false,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      // minWidth: 750,
    },
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

export interface TrackTableProps {
  tracks: CouplingTrack[];
}

const CouplingTrackTable: FC<TrackTableProps> = (props) => {
  const { tracks } = props;

  const classes = useStyles();
  const [order, setOrder] = useState<{ type: OrderType; field: TableFieldId }>({
    type: "asc",
    field: "title",
  });
  const [selectedTrackTitles, setSelectedTrackTitles] = useState<string[]>([]);

  const handleRequestSort = (property: TableFieldId) => (
    event: MouseEvent<unknown>
  ) => {
    const isAsc = order.field === property && order.type === "asc";
    setOrder({
      type: isAsc ? "desc" : "asc",
      field: property,
    });
  };

  const handleClickBodyRow = (title: string) => (
    event: MouseEvent<unknown>
  ) => {
    const selectedIndex = selectedTrackTitles.indexOf(title);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedTrackTitles, title);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedTrackTitles.slice(1));
    } else if (selectedIndex === selectedTrackTitles.length - 1) {
      newSelected = newSelected.concat(selectedTrackTitles.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedTrackTitles.slice(0, selectedIndex),
        selectedTrackTitles.slice(selectedIndex + 1)
      );
    }

    setSelectedTrackTitles(newSelected);
  };

  const isRowSelected = (title: string) =>
    selectedTrackTitles.indexOf(title) !== -1;

  // @ts-ignore
  const sortedTracks = stableSort<CouplingTrack>(
    tracks,
    // @ts-ignore
    getComparator(order.type, order.field)
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <MuiTable
          className={classes.table}
          aria-labelledby="tableTitle"
          size={"small"}
          aria-label="enhanced table"
        >
          <MuiTableHead>
            <MuiTableRow>
              {headCells.map((headCell) =>
                !headCell.sortable ? (
                  <MuiTableCell key={headCell.id} align={headCell.align}>
                    {headCell.label}
                  </MuiTableCell>
                ) : (
                  <MuiTableCell
                    key={headCell.id}
                    align={headCell.align}
                    sortDirection={
                      order.field === headCell.id ? order.type : false
                    }
                  >
                    <MuiTableSortLabel
                      active={order.field === headCell.id}
                      direction={
                        order.field === headCell.id ? order.type : "asc"
                      }
                      onClick={handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {order.field === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order.type === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </MuiTableSortLabel>
                  </MuiTableCell>
                )
              )}
            </MuiTableRow>
          </MuiTableHead>

          <MuiTableBody>
            {sortedTracks.map(
              ({ title, durationString, tracks, playCount }) => {
                const isItemSelected = isRowSelected(title);

                return (
                  <MuiTableRow
                    hover
                    onClick={handleClickBodyRow(title)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={title}
                    selected={isItemSelected}
                  >
                    <MuiTableCell align="left">{title}</MuiTableCell>
                    <MuiTableCell align="right">{durationString}</MuiTableCell>
                    <MuiTableCell align="left">
                      <div
                        css={css`
                          display: flex;
                        `}
                      >
                        {tracks.map((track, index) =>
                          track.artworkBase64 ? (
                            <img
                              key={index}
                              src={track.artworkBase64}
                              width={50}
                            />
                          ) : (
                            <NoArtwork key={index} label={track.artist} />
                          )
                        )}
                      </div>
                    </MuiTableCell>
                    <MuiTableCell align="left">{playCount}</MuiTableCell>
                  </MuiTableRow>
                );
              }
            )}
          </MuiTableBody>
        </MuiTable>
      </Paper>
    </div>
  );
};

export default CouplingTrackTable;
