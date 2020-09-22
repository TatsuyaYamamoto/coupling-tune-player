/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/core";

interface NoArtworkProps {
  label: string;
}

const NoArtwork: FC<NoArtworkProps> = (props) => {
  const { label } = props;
  const displayLabel = label.slice(0, 1);

  return (
    <div
      css={css`
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;

        border: solid 1px black;
      `}
    >
      {displayLabel}
    </div>
  );
};

export default NoArtwork;
