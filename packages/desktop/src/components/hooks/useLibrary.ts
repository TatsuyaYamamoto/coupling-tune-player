import { atom, useRecoilState } from "recoil";
import { CouplingTrack } from "../../models/CouplingTrack";
import { readMusicMetadata } from "../../utils/mainProcessBridge";

const trackState = atom<CouplingTrack[]>({
  key: "trackState",
  default: [],
});

const useLibrary = () => {
  const [tracks, setTracks] = useRecoilState(trackState);

  const loadTracks = (audioFilePaths: string[]) => {
    Promise.all(
      audioFilePaths.map(async (path) => {
        const metadata = await readMusicMetadata(path);
        return { metadata, path };
      })
    ).then((values) => {
      const couplingTracks: CouplingTrack[] = [];

      for (const { metadata, path } of values) {
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
          // Uint8Array
          const bytes = artworkData[0].data;

          // https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string/9458996#9458996
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          artwork = `data:${artworkData[0].format};base64,${base64}`;
        }

        const couplingableTrack = couplingTracks.find((t) => t.title === title);

        if (couplingableTrack) {
          couplingableTrack.tracks.push({
            title,
            album: album || "unknown",
            artist,
            durationSeconds: duration || 0,
            artworkBase64: artwork,
            audioFilePath: path,
          });
          continue;
        }

        couplingTracks.push({
          title,
          durationSeconds: duration || 0,
          tracks: [
            {
              title,
              album: album || "unknown",
              artist,
              durationSeconds: duration || 0,
              artworkBase64: artwork,
              audioFilePath: path,
            },
          ],
          playCount: 0,
        });
      }

      setTracks(couplingTracks);
    });
  };

  return { tracks, loadTracks };
};

export default useLibrary;
