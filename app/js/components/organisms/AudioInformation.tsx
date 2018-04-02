import * as React from "react";
import {Fragment} from "react";

import AutoBind from "autobind-decorator";

import CdCoverPicture from "../molecules/CdCoverImage";
import FileAttacheButton from "../molecules/FileAttacheButton";

@AutoBind
class AudioInformation extends React.Component {
  public render() {
    return (
      <Fragment>
        <CdCoverPicture/>
        <FileAttacheButton onSelected={this.onLeftAudioFileSelected}/>
        <div>
          titles!
        </div>
        <CdCoverPicture/>
        <FileAttacheButton onSelected={this.onRightAudioFileSelected}/>
      </Fragment>
    );
  }

  private onLeftAudioFileSelected(file: File) {
    console.log("Selected left file.", file);
  }

  private onRightAudioFileSelected(file: File) {
    console.log("Selected right file", file);
  }
}

export default AudioInformation;
