import React, { FC, useRef } from "react";
import styled from "@emotion/styled";

import Button, { ButtonProps } from "@material-ui/core/Button";

export interface ComponentProps extends ButtonProps {
  onSelected?: (fileList: FileList) => void;
  accept: string;
  multiple: boolean;
}

const Input = styled.input`
  display: none;
`;

const SelectableButton: FC<ComponentProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClick = (event: any): void => {
    inputRef.current.click();
  };

  const onInputChanged = (e: React.FormEvent<HTMLInputElement>) => {
    // TODO: Check support FileAPI.
    const fileList = e.currentTarget.files;

    if (fileList === null || fileList.length === 0) {
      return;
    }

    if (onSelected) {
      onSelected(fileList);
    }
  };

  const { children, accept, multiple, onSelected, ...others } = props;
  return (
    <React.Fragment>
      <Button color="primary" onClick={onClick} {...others}>
        {children}
      </Button>

      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={inputRef}
        onChange={onInputChanged}
      />
    </React.Fragment>
  );
};

export default SelectableButton;
