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
  Paper,
} from "@material-ui/core";
import { AccessTime as DurationIcon } from "@material-ui/icons";

import VocalList from "./VocalList";
import TableHeadCell from "./TableHeadCell";
import SortableTableHeadCell from "./SortableTableHeadCell";

import { CouplingTrack } from "../../../models/CouplingTrack";
import { getComparator, stableSort } from "../../../utils/calc";

type SortOrderType = "asc" | "desc";

type SortTableField = keyof Pick<CouplingTrack, "title">;

// TODO: cache
const durationSecondsToString = (seconds: number) => {
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = Math.floor(seconds % 60);
  const secondsPartZeroPadding = ("00" + secondsPart).slice(-2);

  return `${minutesPart}:${secondsPartZeroPadding}`;
};

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
  })
);

export interface TrackTableProps extends HTMLAttributes<HTMLDivElement> {
  tracks: CouplingTrack[];
  selectedTracks: { title: string; artist: string }[];
  onSelectTrack: (
    tracks: {
      title: string;
      artist: string;
    }[]
  ) => void;
}

const CouplingTrackTable: FC<TrackTableProps> = (props) => {
  const { tracks, selectedTracks, onSelectTrack, className } = props;

  const classes = useStyles();
  const [sort, setSort] = useState<{
    order: SortOrderType;
    field: SortTableField;
  }>({
    order: "asc",
    field: "title",
  });

  const handleRequestSort = (field: SortTableField) => (
    _: MouseEvent<unknown>
  ) => {
    setSort((prev) => ({
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
      field,
    }));
  };

  const handleSelectTrack = (params: { title: string; artist: string }) => {
    // 未選択
    if (selectedTracks.length === 0) {
      onSelectTrack([params]);
      return;
    }

    // 選択済みの曲と異なる曲を選択した
    if (!selectedTracks[0].title.startsWith(params.title)) {
      onSelectTrack([params]);
      return;
    }

    const selectedIndex = selectedTracks.findIndex(
      (selected) =>
        selected.title === params.title && selected.artist === params.artist
    );

    // 選択した曲が未選択状態
    if (selectedIndex === -1) {
      onSelectTrack([...selectedTracks, params]);
      return;
    }

    // 入力曲選択済み

    // 先頭
    if (selectedIndex === 0) {
      onSelectTrack(selectedTracks.slice(1));
      return;
    }

    // 最後
    if (selectedIndex === selectedTracks.length - 1) {
      onSelectTrack(selectedTracks.slice(0, -1));
      return;
    }

    // 途中
    onSelectTrack(selectedTracks.filter((track) => track !== params));
  };

  const isTrackSelected = (params: { title: string; artist: string }) => {
    return !!selectedTracks.find(
      (selected) =>
        selected.title === params.title && selected.artist === params.artist
    );
  };

  // @ts-ignore
  const sortedTracks = stableSort<CouplingTrack>(
    tracks,
    // @ts-ignore
    getComparator(sort.order, sort.field)
  );

  return (
    <div className={[classes.root, className].join(" ")}>
      <Paper className={classes.paper}>
        <MuiTable className={classes.table} size={"small"}>
          <MuiTableHead>
            <MuiTableRow>
              <SortableTableHeadCell
                align={"left"}
                active={sort.field === "title"}
                direction={sort.order}
                onClick={handleRequestSort("title")}
              >
                {`タイトル`}
              </SortableTableHeadCell>
              <TableHeadCell
                align={"right"}
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <DurationIcon />
              </TableHeadCell>
              <TableHeadCell align={"left"}>{`ボーカル`}</TableHeadCell>
            </MuiTableRow>
          </MuiTableHead>

          <MuiTableBody>
            {sortedTracks.length === 0 && (
              <MuiTableRow hover>
                <MuiTableCell align="left">{`NO ITEM`}</MuiTableCell>
              </MuiTableRow>
            )}
            {sortedTracks.map(({ title, durationSeconds, tracks }) => {
              const durationString = durationSecondsToString(durationSeconds);
              const vocalItems = tracks.map((t) => ({
                title: t.title,
                artist: t.artist,
                artworkBase64: t.artworkBase64 || null,
                selected: isTrackSelected({
                  title: t.title,
                  artist: t.artist,
                }),
              }));
              const isRowSelected =
                2 <= selectedTracks.length && selectedTracks[0].title === title;

              return (
                <MuiTableRow
                  hover={!isRowSelected}
                  tabIndex={-1}
                  key={title}
                  css={css`
                    ${isRowSelected &&
                    css`
                      background-color: rgba(245, 0, 87, 0.08);
                    `}
                  `}
                >
                  <MuiTableCell align="left">{title}</MuiTableCell>
                  <MuiTableCell align="right">{durationString}</MuiTableCell>
                  <MuiTableCell align="left">
                    <VocalList items={vocalItems} onClick={handleSelectTrack} />
                  </MuiTableCell>
                </MuiTableRow>
              );
            })}
          </MuiTableBody>
        </MuiTable>
      </Paper>
    </div>
  );
};

export default CouplingTrackTable;
