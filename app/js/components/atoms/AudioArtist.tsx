import * as React from "react";
import {ReactNode} from "react";
import styled from "styled-components";

const Root = styled.div`
  font-size: 15px;
  @media (max-width: 400px) {
    font-size: 10px;
  }
`;

const NoData = styled.div`
  background-color: lightgray;
  width: 150px;
  height: 15px;
  border-radius: 15px;
`;

interface Props {
  className?: string;
  children?: ReactNode;
}

export default (props: Props) => {
  const {children, className} = props;

  return (
    <Root className={className}>{children || <NoData/>}</Root>
  );
};
