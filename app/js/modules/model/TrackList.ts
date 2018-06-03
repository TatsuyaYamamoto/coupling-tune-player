import TrackListItem from "./TrackListItem";
import Index from "./Index";

class TrackList {
  readonly value: TrackListItem[];

  public constructor(value: TrackListItem[]) {
    this.value = value;
  }

  public get(index: Index): TrackListItem {
    const i = index.value;

    const item = this.value[i];
    if (!item) {
      throw new Error("");
    }

    return item;
  }

  public size(): number {
    return this.value.length;
  }

  public min(): Index {
    return new Index(0);
  }

  public max(): Index {
    return new Index(this.value.length);
  }
}

export default TrackList;
