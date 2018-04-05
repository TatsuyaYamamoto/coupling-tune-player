import * as React from "react";

import styled from "styled-components";

export interface Props {
  src?: string | null;
}

const Image = styled.img`
  width: 200px;
  height: 200px;
  @media (max-width: 400px) {
    width: 150px;
    height: 150px;
  }
`;

const NoImage = Image.extend`
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
