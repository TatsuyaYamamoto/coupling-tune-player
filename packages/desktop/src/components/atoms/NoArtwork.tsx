/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/core";

interface NoArtworkProps {
  label: string;
  selected: boolean;
  onClick?: () => void;
}

const NoArtwork: FC<NoArtworkProps> = (props) => {
  const { label, selected, onClick, ...others } = props;
  const displayLabel = label.slice(0, 1);

  return (
    <div
      {...others}
      css={css`
        cursor: pointer;

        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;

        background-color: antiquewhite;

        border: 2px solid white;
        box-sizing: border-box;

        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.4);

        transition: 300ms;

        ${selected &&
        css`
          box-shadow: 0 0 3px 2px rgb(248, 69, 69);
        `}
      `}
      onClick={onClick}
    >
      {displayLabel}
    </div>
  );
};

export default NoArtwork;
