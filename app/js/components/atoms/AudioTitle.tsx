import * as React from "react";
import {ReactNode} from "react";
import styled from "styled-components";

const Root = styled.div`
  font-size: 35px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 400px) {
    font-size: 20px;
  }
`;

interface Props {
  children?: ReactNode | null;
}

export default (props: Props) => {
  const {children} = props;

  return (
    <Root>{children}</Root>
  );
};
