import * as React from "react";
import {ReactNode} from "react";
import styled from "styled-components";

const Root = styled.div`
`;

const NoData = styled.span`
  display: inline-block;
  background-color: lightgray;
  width: 200px;
  height: 20px;
  border-radius: 10px;
`;

interface Props {
  className?: string;
  children?: ReactNode | null;
}

export default (props: Props) => {
  const {children, className} = props;

  return (
    <Root className={className}>{children || <NoData/>}</Root>
  );
};
