import * as React from "react";
import { default as styled } from "styled-components";

import FileAttacheButton from "../atoms/button/FileAttacheButton";
import CdSvg from "../atoms/CdSvg";

interface Props {
  imageSrc: string | null;
  onAudioSelected?: (fileList: FileList) => void;
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

const CdCover = styled.div`
  width: 300px;
  height: 300px;
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
  const { imageSrc, onAudioSelected, reverse, className } = props;

  const detail = (
    <Detail reverse={reverse}>
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
