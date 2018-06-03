import TrackListItem from "./TrackListItem";
import Index from "./Index";
import Track from "./Track";

class TrackList {
  readonly value: TrackListItem[];

  public constructor(value: TrackListItem[]) {
    this.value = value;
  }

  public get(index: Index): TrackListItem {
    const i = index.value;

    const item = this.value[i];
    if (!item) {
      throw new Error(`No item having provided index, ${i}.`);
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

  /**
   * get updated Track List.
   *
   * @param {"left" | "right"} type
   * @param {Track} provided
   * @returns {TrackList}
   */
  public merge(type: "left" | "right", provided: Track): TrackList {
    const otherSideType = type === "left" ? "right" : "left";
    let newTrack = true;

    const updatedList = this.value.map(item => {
      const ownSide = item[type];
      const otherSide = item[otherSideType];

      if (
        (ownSide && TrackList.matchTitle(provided.title, ownSide.title)) ||
        (otherSide && TrackList.matchTitle(provided.title, otherSide.title))
      ) {
        newTrack = false;

        return {
          ...item,
          [type]: provided
        };
      }

      return item;
    });

    if (newTrack) {
      updatedList.push({
        left: type === "left" ? provided : null,
        right: type === "right" ? provided : null
      });
    }

    return new TrackList(updatedList);
  }

  /**
   * Return true if judged that provide titles are same.
   *
   * @param {string} title1
   * @param {string} title2
   * @param {number} threshold
   * @returns {boolean}
   */
  private static matchTitle(
    title1: string,
    title2: string,
    threshold: number = 3
  ): boolean {
    if (title1.length <= threshold) {
      return title1 === title2;
    }

    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < title1.length - threshold; i++) {
      if (title2.indexOf(title1.substr(i, threshold)) !== -1) {
        return true;
      }
    }

    return false;
  }
}

export default TrackList;
