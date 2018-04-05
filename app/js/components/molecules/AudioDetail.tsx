import * as React from "react";
import styled from "styled-components";

import FileAttacheButton from "../atoms/button/FileAttacheButton";
import Title from "../atoms/AudioTitle";
import Artist from "../atoms/AudioArtist";
import CdCoverPicture from "./CdCoverImage";

import Audio from "../../modules/helper/Audio";

interface Props {
  audio: Audio | null;
  onAudioSelected?: (path: File) => void;
  reverse?: boolean;
}

interface RootProps {
  reverse?: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: ${(props: RootProps) => props.reverse ? "row-reverse" : "row"};
  align-items: center;
  width:100%;
  @media (max-width: 400px) {
    flex-wrap: wrap;
  }
`;

interface DetailProps {
  reverse?: boolean;
}

const Detail = styled.div`
  text-align: ${(props: DetailProps) => props.reverse ? "right" : "left"};
  margin-left: ${(props: DetailProps) => props.reverse ? "0px" : "30px"};
  margin-right: ${(props: DetailProps) => props.reverse ? "30px" : "0px"};
`;

const AudioDetail = (props: Props) => {
  const {
    audio,
    onAudioSelected,
    reverse,
  } = props;

  const detail = (
    <Detail reverse={reverse}>
      <Title>{audio ? audio.title : "DummyTitle"}</Title>
      <Artist>{audio ? audio.artist : "DummyArtist"}</Artist>
      <FileAttacheButton onSelected={onAudioSelected}/>
    </Detail>
  );

  const picture = (<CdCoverPicture src={audio && audio.pictureBase64}/>);

  return (
    <Root reverse={reverse}>
      {picture}
      {detail}
    </Root>
  );
};

export default AudioDetail;
