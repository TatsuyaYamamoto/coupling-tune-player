import * as React from "react";
import {ReactNode} from "react";
import styled from "styled-components";

const Root = styled.div`
`;

const NoData = styled.div`
  background-color: lightgray;
  width: 200px;
  height: 35px;
  border-radius: 15px;
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
