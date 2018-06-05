import * as React from "react";
import { default as AutoBind } from "autobind-decorator";
import { default as styled } from "styled-components";

import { Button } from "material-ui";
import { AttachFile as Icon } from "material-ui-icons";

export interface ComponentProps {
  className?: string;
  reverse?: boolean;
  onSelected?: (fileList: FileList) => void;
}

const Input = styled.input`
  display: none;
`;

@AutoBind
class FileAttacheButton extends React.Component<ComponentProps, {}> {
  private inputRef: HTMLInputElement | null = null;

  public render() {
    const { className, reverse } = this.props;
    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          onClick={this.onClick}
          className={className}
        >
          {!reverse && <Icon />}
          {reverse ? "Right Track" : "Left Track"}
          {reverse && <Icon />}
        </Button>

        <Input
          type="file"
          accept="audio/*"
          multiple={true}
          innerRef={this.setInnerRef}
          onChange={this.onInputChanged}
        />
      </React.Fragment>
    );
  }

  private onClick(event: any): void {
    if (!this.inputRef) {
      return;
    }

    this.inputRef.click();
  }

  private setInnerRef(ref: HTMLInputElement) {
    this.inputRef = ref;
  }

  private onInputChanged(e: React.FormEvent<HTMLInputElement>) {
    // TODO: Check support FileAPI.
    const fileList = e.currentTarget.files;

    if (fileList === null || fileList.length === 0) {
      return;
    }

    if (this.props.onSelected) {
      this.props.onSelected(fileList);
    }
  }
}

export default FileAttacheButton;
