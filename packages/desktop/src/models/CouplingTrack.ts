import { Track } from "./Track";

export interface CouplingTrack {
  title: string;
  durationSeconds: number;
  tracks: Track[];
  playCount: number;
}
