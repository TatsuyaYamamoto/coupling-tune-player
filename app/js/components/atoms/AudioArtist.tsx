import * as React from "react";
import {ReactNode} from "react";
import styled from "styled-components";

const Root = styled.div`
  font-size: 15px;
  @media (max-width: 400px) {
    font-size: 10px;
  }
`;

interface Props {
  children?: ReactNode;
}

export default (props: Props) => {
  const {children} = props;

  return (
    <Root>{children}</Root>
  );
};
