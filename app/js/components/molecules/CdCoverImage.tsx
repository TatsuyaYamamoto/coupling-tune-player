import * as React from "react";

import styled from "styled-components";

export interface Props {
  src?: string | null;
}

const Image = styled.img`
  width: 100px;
  height: 100px;
`;

const NoImage = styled.img`
  width: 100px;
  height: 100px;
  background-color: gray;
`;

const CdCoverPicture = (props: Props) => {
  const {src} = props;

  if (!src) {
    return <NoImage/>;
  }

  return <Image src={src}/>;
};

export default CdCoverPicture;
