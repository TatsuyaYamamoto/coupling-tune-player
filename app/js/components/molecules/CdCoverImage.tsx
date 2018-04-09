import * as React from "react";

import styled from "styled-components";

import CdSvg from "../atoms/CdSvg";

export interface Props {
  src?: string | null;
  className?: string;
}

const Image = styled.img`
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
    return <NoImage className={className}/>;
  }

  return <Image src={src} className={className}/>;
};

export default CdCoverPicture;
