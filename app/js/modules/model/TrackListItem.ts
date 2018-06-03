import Track from "./Track";

class TrackListItem {
  readonly left: Track | null;
  readonly right: Track | null;

  public constructor(left: Track, right: Track) {
    this.left = left;
    this.right = right;
  }
}

export default TrackListItem;
