import * as React from "react";
import { default as styled } from "styled-components";

import FileAttacheButton from "../atoms/button/FileAttacheButton";
import { default as Title } from "../atoms/AudioTitle";
import { default as Artist } from "../atoms/AudioArtist";
import CdSvg from "../atoms/CdSvg";

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
  flex-direction: ${(props: RootProps) =>
    props.reverse ? "row-reverse" : "row"};
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

const CdCover = styled.div`
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
  text-align: ${(props: DetailProps) => (props.reverse ? "right" : "left")};
  margin-left: ${(props: DetailProps) => (props.reverse ? "0px" : "30px")};
  margin-right: ${(props: DetailProps) => (props.reverse ? "30px" : "0px")};
`;

const FileButton = styled(FileAttacheButton)`
  margin: 10px !important;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const NoImage = styled(CdSvg)`
  width: 100%;
  height: 100%;
`;

const AudioDetail = (props: Props) => {
  const {
    title,
    artist,
    imageSrc,
    onAudioSelected,
    reverse,
    className
  } = props;

  const detail = (
    <Detail reverse={reverse}>
      <WrapTitle>{title}</WrapTitle>
      <WrapArtist>{artist}</WrapArtist>
      <FileButton onSelected={onAudioSelected} />
    </Detail>
  );

  const picture = (
    <CdCover>{imageSrc ? <Image src={imageSrc} /> : <NoImage />}</CdCover>
  );

  return (
    <Root className={className} reverse={reverse}>
      {picture}
      {detail}
    </Root>
  );
};

export default AudioDetail;
