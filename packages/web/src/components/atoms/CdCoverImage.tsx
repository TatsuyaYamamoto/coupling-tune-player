import React, { FC } from "react";
import styled from "@emotion/styled";

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

interface CdCoverImageProps {
  src: string;
}
const CdCoverImage: FC<CdCoverImageProps> = props => {
  const { src, ...others } = props;

  return <Image src={src} {...others} />;
};

export default CdCoverImage;
