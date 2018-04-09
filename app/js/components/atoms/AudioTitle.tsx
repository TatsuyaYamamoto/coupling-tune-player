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
