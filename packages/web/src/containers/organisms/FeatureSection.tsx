/** @jsx jsx */
import React, { FC } from "react";
import { css, jsx } from "@emotion/core";

interface FeatureItemProps {
  icon: any;
  title: string;
  message: any;
}

const FeatureItem: FC<FeatureItemProps> = (props) => {
  const { icon, title, message, ...others } = props;
  return (
    <div
      css={css`
        flex-grow: 1;
      `}
      {...others}
    >
      <div
        css={css`
          text-align: center;
          font-size: 50px;
        `}
      >
        {icon}
      </div>
      <div>
        <div
          css={css`
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
          `}
        >
          {title}
        </div>
        <div
          css={css`
            font-size: 16px;
            margin-top: 10px;
            word-wrap: break-word;
          `}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

const FeatureSection: FC = () => {
  const bold = css`
    font-weight: bold;
  `;
  const items = [
    {
      icon: <i className="fas fa-sync-alt" css={[]} aria-hidden />,
      title: "同時再生できる",
      message: (
        <>
          複数の音声ファイルを同時に再生出来る
          <span css={bold}>音楽プレイヤー</span>
          。mp3等の圧縮ファイルで再生位置がズレている場合、自動で調整します（すごい）。
        </>
      ),
    },
    {
      icon: <i className="far fa-check-square" css={[]} aria-hidden />,
      title: "好きな曲、ボーカルで",
      message: (
        <>
          再生する曲、ボーカルを<span css={bold}>自由に組み合わせる</span>
          ことが出来ます。推しカプよ、轟け！
        </>
      ),
    },
    {
      icon: <i className="fab fa-angellist" css={[]} aria-hidden />,
      title: "楽しい！",
      message: (
        <>
          やった！！<span css={bold}>優勝！！</span>
          誰が歌っているか当てる、カップリング再生利き声選手権とか面白そうだね！
        </>
      ),
    },
  ];

  return (
    <section
      css={css`
        max-width: 900px;
        margin: 100px auto 0;
        padding: 0 10px;
      `}
    >
      <div>
        <h3
          css={css`
font-size: 30px;
            text-align: center;
          `}
        >
          これなんなん？
        </h3>
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        {items.map((item, index) => (
          <FeatureItem
            key={index}
            css={css`
              margin: 0 10px;
            `}
            icon={item.icon}
            title={item.title}
            message={item.message}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
