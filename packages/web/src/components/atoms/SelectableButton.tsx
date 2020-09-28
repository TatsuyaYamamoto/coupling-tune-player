import * as React from "react";
import styled from "styled-components";

import { default as Button, ButtonProps } from "@material-ui/core/Button";

export interface ComponentProps extends ButtonProps {
  onSelected?: (fileList: FileList) => void;
  accept: string;
  multiple: boolean;
}

const Input = styled.input`
  display: none;
`;

class SelectableButton extends React.Component<ComponentProps, {}> {
  private inputRef: HTMLInputElement | null = null;

  public render() {
    const { children, accept, multiple, onSelected, ...others } = this.props;
    return (
      <React.Fragment>
        <Button color="primary" onClick={this.onClick} {...others}>
          {children}
        </Button>

        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          innerRef={this.setInnerRef}
          onChange={this.onInputChanged}
        />
      </React.Fragment>
    );
  }

  private onClick = (event: any): void => {
    if (!this.inputRef) {
      return;
    }

    this.inputRef.click();
  };

  private setInnerRef = (ref: HTMLInputElement) => {
    this.inputRef = ref;
  };

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

export default SelectableButton;
