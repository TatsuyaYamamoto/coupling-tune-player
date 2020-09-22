/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/core";

interface NoArtworkProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

const NoArtwork: FC<NoArtworkProps> = (props) => {
  const { label, selected, onClick } = props;
  const displayLabel = label.slice(0, 1);

  return (
    <div
      css={css`
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;

        border: ${selected ? `solid 2px red;` : `solid 1px black;`};
      `}
      onClick={onClick}
    >
      {displayLabel}
    </div>
  );
};

export default NoArtwork;
