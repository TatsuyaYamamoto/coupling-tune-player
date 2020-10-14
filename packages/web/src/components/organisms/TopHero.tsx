/** @jsx jsx */
import React, { FC } from "react";
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";

import LogoSvg from "../../../public/images/logo.svg";

const Strong = styled.span`
  font-weight: bold;
`;

const InlineBlock = styled.span`
  display: inline-block;
`;

const TopHero: FC = () => {
  return (
    <section
      css={css`
        max-width: 900px;
        margin: 0 auto;
        padding: 0 10px;
      `}
    >
      <div
        css={css`
          margin: 30px auto;
          text-align: center;
        `}
      >
        <LogoSvg
          css={css`
            width: 100px;
            height: 100px;
          `}
        />
      </div>
      <div
        css={css`
          text-align: center;
        `}
      >
        <h1
          css={css`
            font-size: 36px;
            font-family: "Nico Moji";
          `}
        >
          かぷちゅうプレイヤー
        </h1>
        <div>
          <InlineBlock>
            すきな
            <Strong>か</Strong>っ<Strong>ぷ</Strong>
            りんぐで
          </InlineBlock>
          <InlineBlock>
            もっと
            <Strong>ちゅう</Strong>
            どくになれる
          </InlineBlock>
          <InlineBlock>
            おんがく
            <Strong>プレイヤー</Strong>
          </InlineBlock>
        </div>
      </div>
    </section>
  );
};

export default TopHero;
