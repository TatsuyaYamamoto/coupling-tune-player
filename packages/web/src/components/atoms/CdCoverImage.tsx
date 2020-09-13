import * as React from "react";
import { default as styled } from "styled-components";

import CdSvg from "./icon/CdSvg";

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

interface CdCoverImageProps {
  src: string;
}
const CdCoverImage: React.SFC<CdCoverImageProps> = props => {
  const { src, ...others } = props;

  return <Image src={src} {...others} />;
};

export default CdCoverImage;
