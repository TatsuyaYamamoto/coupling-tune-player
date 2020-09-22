/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/core";

interface NoArtworkProps {
  src: string;
  selected: boolean;
  onClick?: () => void;
}

const Artwork: FC<NoArtworkProps> = (props) => {
  const { src, selected, onClick } = props;

  return (
    <img
      css={css`
        width: 50px;
        height: 50px;

        border: ${selected ? `solid 2px red;` : `solid 1px black;`};
      `}
      src={src}
      onClick={onClick}
    />
  );
};

export default Artwork;
