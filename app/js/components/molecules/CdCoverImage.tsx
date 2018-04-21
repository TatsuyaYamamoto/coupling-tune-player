import * as React from "react";

import styled from "styled-components";

import CdSvg from "../atoms/CdSvg";

export interface Props {
  src?: string | null;
  className?: string;
}

const Image = styled.img`
  width: 100%;
	height: 100%;
`;

const NoImage = styled(CdSvg)`
  fill: gray;
  background-color: lightgray;
`;

const CdCoverPicture = (props: Props) => {
  const {
    src,
    className,
  } = props;

  if (!src) {
    return <div className={className}><NoImage/></div>;
  }

  return <div className={className}><Image src={src}/></div>;
};

export default CdCoverPicture;
