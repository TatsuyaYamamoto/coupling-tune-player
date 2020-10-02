import React, { FC } from "react";
import { keyframes, css } from "@emotion/core";
import styled from "@emotion/styled";

const MIN_HEIGHT = `20%`;
const MAX_HEIGHT = `100%`;

const SoundAnimation = keyframes`
    0% {
      height: ${MIN_HEIGHT};
    }
    100% {
      height: ${MAX_HEIGHT}
    }
`;

const Root = styled.div`
  position: relative;
  display: inline-block;
  height: 24px;
  width: 24px;
`;
const Bar = styled.div`
  background: #000000;
  position: absolute;
  bottom: 0;
  width: 6px;
  height: ${MIN_HEIGHT};
  animation: ${(props: { animation: boolean }) =>
    props.animation
      ? css`
          ${SoundAnimation} 0ms -800ms linear infinite alternate;
        `
      : ""};
`;

const BottomBar = styled(Bar)`
  left: 2px;
  animation-duration: 474ms;
`;
const MiddleBar = styled(Bar)`
  left: 9px;
  animation-duration: 333ms;
`;
const HighBar = styled(Bar)`
  left: 16px;
  animation-duration: 407ms;
`;

export interface PlayingIconProps {
  animation: boolean;
}

const PlayingIcon: FC<PlayingIconProps> = (props) => {
  const { animation } = props;

  return (
    <Root>
      <BottomBar animation={animation} />
      <MiddleBar animation={animation} />
      <HighBar animation={animation} />
    </Root>
  );
};

export default PlayingIcon;
