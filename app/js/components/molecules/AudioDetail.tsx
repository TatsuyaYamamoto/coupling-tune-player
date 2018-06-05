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

const Root = styled.div`
  text-align: center;
`;

const CdCover = styled.div`
  width: 300px;
  height: 300px;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
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

  const image = imageSrc ? <Image src={imageSrc} /> : <NoImage />;

  return (
    <Root className={className}>
      <CdCover>{image}</CdCover>
      <FileButton reverse={reverse} onSelected={onAudioSelected} />
    </Root>
  );
};

export default AudioDetail;
