export interface Track {
  title: string;
  album: string;
  artist: string;
  durationSeconds: number;
  artworkBase64?: string;
  audioFilePath: string;
}
