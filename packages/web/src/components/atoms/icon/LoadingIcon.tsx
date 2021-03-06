import React, { FC } from "react";
import styled from "@emotion/styled";

import { Refresh } from "@material-ui/icons";

interface Props {
  animation?: boolean;
}

const AnimatedIcon = styled(Refresh)`
  animation: spin 1.5s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingIcon: FC<Props> = props => {
  const { animation } = props;

  return animation ? <AnimatedIcon /> : <Refresh />;
};

export default LoadingIcon;
