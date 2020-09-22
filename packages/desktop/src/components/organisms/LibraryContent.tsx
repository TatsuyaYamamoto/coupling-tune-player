import React, { FC, useState } from "react";
import { jsx } from "@emotion/core";
import {
  openAudioFileSelectDialog,
  readAsArrayBuffer,
  readMusicMetadata,
} from "../../utils/mainProcessBridge";
import CouplingTrackTable from "./CouplingTrackTable";
import { CouplingTrack } from "../../models/CouplingTrack";

const LibraryContent: FC = () => {
  const [tracks, setTracks] = useState<CouplingTrack[]>([]);

  const loadAudio = async () => {
    const audioFilePaths = await openAudioFileSelectDialog();
    if (audioFilePaths) {
      Promise.all(
        audioFilePaths.map(async (path) => {
          const metadata = await readMusicMetadata(path);
          return { metadata, path };
        })
      ).then((values) => {
        const couplingTracks: CouplingTrack[] = [];

        for (const { metadata, path } of values) {
          const {
            title,
            artist,
            album,
            picture: artworkData,
          } = metadata.common;
          const { duration } = metadata.format;

          if (!title || !artist) {
            // タイトル、アーティスト名が分からないと、カップリングもクソもない。
            // TODO filepathから解決できるかも？
            // TODO 同じフォルダ、で推測出来るかも？
            continue;
          }

          let artwork;
          if (artworkData) {
            const base64 = btoa(
              String.fromCharCode(
                // @ts-ignore
                ...new Uint8Array(artworkData[0].data)
              )
            );
            artwork = `data:${artworkData[0].format};base64,${base64}`;
          }

          const couplingableTrack = couplingTracks.find(
            (t) => t.title === title
          );

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

          const t = new CouplingTrack(
            title,
            duration || 0,
            [
              {
                title,
                album: album || "unknown",
                artist,
                durationSeconds: duration || 0,
                artworkBase64: artwork,
                audioFilePath: path,
              },
            ],
            0
          );

          couplingTracks.push(t);
        }

        setTracks(couplingTracks);
      });
    }
  };

  return (
    <div>
      <h1>Library</h1>
      <button onClick={loadAudio}>LOAD</button>
      <CouplingTrackTable tracks={tracks} />
    </div>
  );
};

export default LibraryContent;
