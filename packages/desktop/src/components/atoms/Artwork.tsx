/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/core";

interface ArtworkProps {
  src: string;
  selected: boolean;
  onClick?: () => void;
}

const Artwork: FC<ArtworkProps> = (props) => {
  const { src, selected, onClick, ...others } = props;

  return (
    <img
      {...others}
      css={css`
        cursor: pointer;
        width: 50px;
        height: 50px;

        border: 2px solid white;
        box-sizing: border-box;

        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.4);

        transition: 300ms;

        ${selected &&
        css`
          box-shadow: 0 0 3px 2px rgb(248, 69, 69);
        `}
      `}
      src={src}
      onClick={onClick}
    />
  );
};

export default Artwork;
