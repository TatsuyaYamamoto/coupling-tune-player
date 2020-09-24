/** @jsx jsx */
import React, { FC } from "react";
import Artwork from "../../atoms/Artwork";
import NoArtwork from "../../atoms/NoArtwork";
import { css, jsx } from "@emotion/core";

interface VocalListProps {
  items: {
    title: string;
    artist: string;
    artworkBase64: string | null;
    selected: boolean;
  }[];
  onClick: (params: { title: string; artist: string }) => void;
}

const VocalList: FC<VocalListProps> = (props) => {
  const { items, onClick } = props;

  const handleClick = (title: string, artist: string) => () => {
    onClick({ title, artist });
  };

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      {items.map((item, index) =>
        item.artworkBase64 ? (
          <Artwork
            key={index}
            css={css`
              margin: 0 5px;
            `}
            src={item.artworkBase64}
            selected={item.selected}
            onClick={handleClick(item.title, item.artist)}
          />
        ) : (
          <NoArtwork
            key={index}
            css={css`
              margin: 0 5px;
            `}
            label={item.artist}
            selected={item.selected}
            onClick={handleClick(item.title, item.artist)}
          />
        )
      )}
    </div>
  );
};

export default VocalList;
