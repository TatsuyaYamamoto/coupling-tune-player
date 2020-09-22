/** @jsx jsx */
import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/core";

import CouplingTrackTable from "../CouplingTrackTable/CouplingTrackTable";
import LibraryHeader from "./LibraryHeader";

import { CouplingTrack } from "../../../models/CouplingTrack";
import {
  openAudioFileSelectDialog,
  readMusicMetadata,
} from "../../../utils/mainProcessBridge";

const LibraryContent: FC = () => {
  const [tracks, setTracks] = useState<CouplingTrack[]>([]);

  const onLoadRequest = async () => {
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
      <LibraryHeader
        css={css`
          min-width: 700px;
          margin: 30px 50px;
        `}
        onLoadRequest={onLoadRequest}
      />
      <CouplingTrackTable
        css={css`
          margin: 0 50px;
        `}
        tracks={tracks}
      />
    </div>
  );
};

export default LibraryContent;
