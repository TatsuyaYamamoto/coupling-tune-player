import { atom, useRecoilState } from "recoil";

import { CouplingTrack } from "../../models/CouplingTrack";
import { readMusicMetadata } from "../../utils/mainProcessBridge";
import { encodeBase64ImageFromArray } from "../../utils/calc";

const trackState = atom<CouplingTrack[]>({
  key: "trackState",
  default: [],
});

const useLibrary = () => {
  const [tracks, setTracks] = useRecoilState(trackState);

  const loadTracks = async (audioFilePaths: string[]) => {
    const metadataAndPathList = await Promise.all(
      audioFilePaths.map(async (path) => {
        const metadata = await readMusicMetadata(path);
        return { metadata, path };
      })
    );

    setTracks((prev) => {
      const couplingTracks: CouplingTrack[] = [...prev];

      for (const { metadata, path } of metadataAndPathList) {
        const { title, artist, album, picture: artworkData } = metadata.common;
        const { duration } = metadata.format;

        if (!title || !artist) {
          // タイトル、アーティスト名が分からないと、カップリングもクソもない。
          // TODO filepathから解決できるかも？
          // TODO 同じフォルダ、で推測出来るかも？
          continue;
        }

        let artwork;
        if (artworkData) {
          const bytes = artworkData[0].data;
          artwork = encodeBase64ImageFromArray(bytes, artworkData[0].format);
        }

        const newTrack = {
          title,
          album: album || "unknown",
          artist,
          durationSeconds: duration || 0,
          artworkBase64: artwork,
          audioFilePath: path,
        };

        const couplableTrackIndex = couplingTracks.findIndex((t) => {
          return t.title === title;
        });
        const couplableTrack = couplingTracks[couplableTrackIndex];

        if (!couplableTrack) {
          couplingTracks.push({
            title,
            durationSeconds: duration || 0,
            tracks: [newTrack],
            playCount: 0,
          });
          continue;
        }

        const coupledArtistTrack = couplableTrack.tracks.find(
          (t) => t.artist === artist
        );

        if (!coupledArtistTrack) {
          couplingTracks[couplableTrackIndex] = {
            ...couplableTrack,
            tracks: [...couplableTrack.tracks, newTrack],
          };
          continue;
        }

        // ignore
        console.log("provided artist's track is duplicated.", title, artist);
      }

      return couplingTracks;
    });
  };

  return { tracks, loadTracks };
};

export default useLibrary;
