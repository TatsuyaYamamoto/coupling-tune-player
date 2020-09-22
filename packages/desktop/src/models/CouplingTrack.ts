import { Track } from "./Track";

export class CouplingTrack {
  private cachedDurationString?: string;

  public constructor(
    readonly title: string,
    readonly durationSeconds: number,
    readonly tracks: Track[],
    readonly playCount: number
  ) {}

  public get durationString(): string {
    if (this.cachedDurationString) {
      return this.cachedDurationString;
    }

    const minutesPart = Math.floor(this.durationSeconds / 60);
    const secondsPart = Math.floor(this.durationSeconds % 60);
    const secondsPartZeroPadding = ("00" + secondsPart).slice(-2);
    this.cachedDurationString = `${minutesPart}:${secondsPartZeroPadding}`;

    return this.cachedDurationString;
  }
}
