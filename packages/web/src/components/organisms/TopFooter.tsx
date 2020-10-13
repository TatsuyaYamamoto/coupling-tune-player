/** @jsx jsx */
import React, { FC } from "react";
import { css, jsx } from "@emotion/core";

const TopFooter: FC = () => {
  return (
    <footer
      css={css`
        width: 100%;
        background-color: orange;

        margin: 100px auto 0;
        position: relative;
      `}
    >
      <div
        css={css`
          max-width: 900px;
          margin: 100px auto 0;
          padding: 0 10px;
        `}
      >
        <div
          css={css`
            padding: 20px 0;
          `}
        >
          <div
            css={css`
              text-align: center;
              margin: 20px 0;
            `}
          >
            <span>そこんところ工房</span>
          </div>
        </div>
        <div css={css``}>
          {`Released under the `}
          <a>MIT License</a>
          {`. `}
          <span>
            {`© 2020 `}
            <a target="_blank" href="http://www.sokontokoro-factory.net/">
              Sokontokoro Factory
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default TopFooter;
