/** @jsx jsx */
import React, { FC, HTMLAttributes, useState } from "react";
import { jsx, css } from "@emotion/core";

import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

interface LibraryHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onLoadRequest: () => void;
}

const LibraryHeader: FC<LibraryHeaderProps> = (props) => {
  const { onLoadRequest, className } = props;

  return (
    <div
      className={className}
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={css`
          font-size: 50px;
          margin-right: 50px;
        `}
      >
        Library
      </div>
      <Fab onClick={onLoadRequest}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default LibraryHeader;
