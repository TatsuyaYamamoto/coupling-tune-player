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
import { AudioListItem } from "../../../modules/audiolist";

export interface ComponentProps {
  className?: string;
  list: AudioListItem[] | null;
  playingIndex: number | null;
  onRowClicked: (index: number) => void;
}

const NoTrackInfo = () => (
  <TableCell padding={"none"} style={{ textAlign: "center" }} colSpan={3}>
    No track.
  </TableCell>
);

const LeftTrack = ({ title, artist }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "right" }}>
    <span>
      {title} / {artist}
    </span>
  </TableCell>
);

const TrackNumber = ({ trackNumber }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "center" }}>
    <span>{trackNumber}</span>
  </TableCell>
);

const RightTrack = ({ title, artist }: any) => (
  <TableCell padding={"none"} style={{ textAlign: "left" }}>
    <span>
      {title} / {artist}
    </span>
  </TableCell>
);

const TrackTable: React.SFC<ComponentProps> = props => {
  const { list, playingIndex, onRowClicked } = props;

  if (!list || list.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <NoTrackInfo />
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {list.map((listItem, index) => {
        const trackNumber = index + 1;
        const leftTitle = listItem.left ? listItem.left.title : "---";
        const leftArtist = listItem.left ? listItem.left.artist : "---";
        const rightTitle = listItem.right ? listItem.right.title : "---";
        const rightArtist = listItem.right ? listItem.right.artist : "---";

        const selected = playingIndex === index;
        const key = index + leftTitle + rightTitle;
        const onClick = () => onRowClicked(index);

        return (
          <TableRow
            key={key}
            hover={true}
            selected={selected}
            onClick={onClick}
            style={{ cursor: "pointer" }}
          >
            <LeftTrack title={leftTitle} artist={leftArtist} />
            <TrackNumber trackNumber={trackNumber} />
            <RightTrack title={rightTitle} artist={rightArtist} />
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default TrackTable;
