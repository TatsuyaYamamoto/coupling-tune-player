/** @jsx jsx */
import React, { FC, useState, MouseEvent, HTMLAttributes } from "react";
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

import Artwork from "./Artwork";
import NoArtwork from "../../atoms/NoArtwork";

import { CouplingTrack } from "../../../models/CouplingTrack";
import { getComparator, stableSort } from "../../../utils/calc";

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
      // width: "100%",
    },
    paper: {
      // width: "100%",
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

export interface TrackTableProps extends HTMLAttributes<HTMLDivElement> {
  tracks: CouplingTrack[];
}

const CouplingTrackTable: FC<TrackTableProps> = (props) => {
  const { tracks, className } = props;

  const classes = useStyles();
  const [order, setOrder] = useState<{ type: OrderType; field: TableFieldId }>({
    type: "asc",
    field: "title",
  });
  const [selectedTrackKeys, setSelectedTrackKeys] = useState<string[]>([]);

  const handleRequestSort = (property: TableFieldId) => (
    event: MouseEvent<unknown>
  ) => {
    const isAsc = order.field === property && order.type === "asc";
    setOrder({
      type: isAsc ? "desc" : "asc",
      field: property,
    });
  };

  const handleSelectTrack = (params: {
    title: string;
    artist: string;
  }) => () => {
    const key = `${params.title}__${params.artist}`;

    // 未選択
    if (selectedTrackKeys.length === 0) {
      setSelectedTrackKeys([key]);
      return;
    }

    // 選択済みの曲と異なる曲を選択した
    if (!selectedTrackKeys[0].startsWith(params.title)) {
      setSelectedTrackKeys([key]);
      return;
    }

    const selectedIndex = selectedTrackKeys.indexOf(key);

    // 選択した曲が未選択状態
    if (selectedIndex === -1) {
      // 2曲以上選択されていたら、1曲押し出す
      if (2 <= selectedTrackKeys.length) {
        setSelectedTrackKeys((prev) => [...prev.slice(1), key]);
      } else {
        setSelectedTrackKeys((prev) => [...prev, key]);
      }
      return;
    }

    // 入力曲選択済み

    // 先頭
    if (selectedIndex === 0) {
      setSelectedTrackKeys(selectedTrackKeys.slice(1));
      return;
    }

    // 最後
    if (selectedIndex === selectedTrackKeys.length - 1) {
      setSelectedTrackKeys(selectedTrackKeys.slice(0, -1));
      return;
    }

    // 途中
    setSelectedTrackKeys((prev) => {
      return prev.filter((selectedKey) => selectedKey !== key);
    });
  };

  const isTrackSelected = (params: { title: string; artist: string }) => {
    const key = `${params.title}__${params.artist}`;
    return selectedTrackKeys.indexOf(key) !== -1;
  };

  // @ts-ignore
  const sortedTracks = stableSort<CouplingTrack>(
    tracks,
    // @ts-ignore
    getComparator(order.type, order.field)
  );

  return (
    <div className={[classes.root, className].join(" ")}>
      <Paper className={classes.paper}>
        <MuiTable
          className={classes.table}
          aria-labelledby="tableTitle"
          size={"small"}
          aria-label="enhanced table"
          stickyHeader={true}
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
            {sortedTracks.length === 0 && (
              <MuiTableRow hover>
                <MuiTableCell align="left">{`NO ITEM`}</MuiTableCell>
              </MuiTableRow>
            )}
            {sortedTracks.map(
              ({ title, durationString, tracks, playCount }) => {
                return (
                  <MuiTableRow hover tabIndex={-1} key={title}>
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
                            <Artwork
                              key={index}
                              src={track.artworkBase64}
                              selected={isTrackSelected({
                                title: track.title,
                                artist: track.artist,
                              })}
                              onClick={handleSelectTrack({
                                title: track.title,
                                artist: track.artist,
                              })}
                            />
                          ) : (
                            <NoArtwork
                              key={index}
                              label={track.artist}
                              selected={isTrackSelected({
                                title: track.title,
                                artist: track.artist,
                              })}
                              onClick={handleSelectTrack({
                                title: track.title,
                                artist: track.artist,
                              })}
                            />
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
