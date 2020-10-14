/** @jsx jsx */
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";

import { css, jsx } from "@emotion/core";
import { Button } from "@material-ui/core";

const active = css`
  color: orange;
`;

const buttonStyle = css`
  cursor: pointer;

  font-size: 18px;
  margin: 0 0.4em;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const iconStyle = css`
  font-size: 24px;
  vertical-align: bottom;
  margin-right: 0.25rem;
`;

type SupportPlatform = "macos" | "windows" | "web";

const StartGuide: FC = () => {
  const [activePlatform, setActivePlatform] = useState<SupportPlatform>("web");

  const handlePlatform = (platform: SupportPlatform) => () => {
    setActivePlatform(platform);
  };

  useEffect(() => {
    if (navigator.platform === "MacIntel") {
      setActivePlatform("macos");
      return;
    }
    if (navigator.platform === "Win32") {
      setActivePlatform("windows");
      return;
    }
  }, []);

  return (
    <section
      css={css`
        max-width: 900px;
        margin: 100px auto 0;
        padding: 0 10px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        <div
          css={css`
            flex: 1;
            text-align: center;

            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <div
            css={css`
              min-width: 200px;
            `}
          >
            <div
              css={css`
                list-style: none;
                text-align: left;
              `}
            >
              <div
                css={[buttonStyle, activePlatform === "macos" && active]}
                onClick={handlePlatform("macos")}
              >
                <i className="fab fa-apple" css={[iconStyle]} aria-hidden />
                macOS
              </div>
              <div
                css={[buttonStyle, activePlatform === "windows" && active]}
                onClick={handlePlatform("windows")}
              >
                <i className="fab fa-windows" css={[iconStyle]} aria-hidden />
                Windows
              </div>
              <div
                css={[buttonStyle, activePlatform === "web" && active]}
                onClick={handlePlatform("web")}
              >
                <i
                  className="fas fa-window-maximize"
                  css={[iconStyle]}
                  aria-hidden
                />
                Web
              </div>
            </div>

            <div>
              {(activePlatform === "macos" || activePlatform === "windows") && (
                <Link href={`/`} passHref>
                  <Button disabled>アプリをダウンロード</Button>
                </Link>
              )}
              {activePlatform === "web" && (
                <Link href="/web-player" passHref>
                  <Button>ウェブプレイヤーを起動</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div
          css={css`
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 250px;
          `}
        >
          <img
            src={`/images/platform_screenshot_${activePlatform}.jpg`}
            css={css`
              width: 300px;
              box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.4);
            `}
          />
        </div>
      </div>
    </section>
  );
};

export default StartGuide;
