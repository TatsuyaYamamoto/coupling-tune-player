import * as React from "react";
import {Fragment} from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

import Button from "material-ui/Button";
import Icon from "material-ui-icons/AttachFile";

export interface ComponentProps {
  onSelected: (path: File) => void;
}

const Input = styled.input`
  display: none;
`;

@AutoBind
class FileAttacheButton extends React.Component<ComponentProps, {}> {
  private inputRef: HTMLInputElement | null = null;

  public render() {
    return (
      <Fragment>

        <Button
          variant="fab"
          color="secondary"
          aria-label="edit"
          onClick={this.onClick}
        >
          <Icon/>
        </Button>

        <Input
          type="file"
          innerRef={this.setInnerRef}
          onChange={this.onInputChanged}
        />

      </Fragment>
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

    this.props.onSelected(fileList[0]);
  }
}

export default FileAttacheButton;
