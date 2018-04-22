import * as React from "react";
import styled from "styled-components";

import FileAttacheButton from "../atoms/button/FileAttacheButton";
import Title from "../atoms/AudioTitle";
import Artist from "../atoms/AudioArtist";
import CdCoverPicture from "./CdCoverImage";

interface Props {
  title: string | null;
  artist: string | null;
  imageSrc: string | null;
  onAudioSelected?: (path: File) => void;
  reverse?: boolean;
  className?: string;
}

interface RootProps {
  reverse?: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: ${(props: RootProps) => props.reverse ? "row-reverse" : "row"};
  align-items: center;
`;

const WrapTitle = styled(Title)`
  margin-top: 5px;
  margin-bottom: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 35px;
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const WrapArtist = styled(Artist)`
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 15px;
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const CdCover = styled(CdCoverPicture)`
  width: 200px;
  height: 200px;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

interface DetailProps {
  reverse?: boolean;
}

const Detail = styled.div`
  flex: 1;
  overflow: hidden;
  text-align: ${(props: DetailProps) => props.reverse ? "right" : "left"};
  margin-left: ${(props: DetailProps) => props.reverse ? "0px" : "30px"};
  margin-right: ${(props: DetailProps) => props.reverse ? "30px" : "0px"};
`;

const AudioDetail = (props: Props) => {
  const {
    title,
    artist,
    imageSrc,
    onAudioSelected,
    reverse,
    className,
  } = props;

  const detail = (
    <Detail reverse={reverse}>
      <WrapTitle>{title}</WrapTitle>
      <WrapArtist>{artist}</WrapArtist>
      <FileAttacheButton onSelected={onAudioSelected}/>
    </Detail>
  );

  const picture = (<CdCover src={imageSrc}/>);

  return (
    <Root className={className} reverse={reverse}>
      {picture}
      {detail}
    </Root>
  );
};

export default AudioDetail;
