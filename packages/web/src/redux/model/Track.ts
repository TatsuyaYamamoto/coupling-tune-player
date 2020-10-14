import Song from "./Song";

class Track {
  readonly left: Song | null;
  readonly right: Song | null;

  public constructor(left: Song, right: Song) {
    this.left = left;
    this.right = right;
  }
}

export default Track;
