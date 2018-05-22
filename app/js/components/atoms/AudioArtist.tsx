import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const Root = styled.div``;

const NoData = styled.span`
  display: inline-block;
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
  const { children, className } = props;

  return <Root className={className}>{children || <NoData />}</Root>;
};
