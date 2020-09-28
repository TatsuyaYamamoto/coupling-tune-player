import React, { FC } from "react";
import styled from "@emotion/styled";
import { WithTheme, withTheme } from "@material-ui/core";

import SelectableButton from "../atoms/SelectableButton";

interface TrackSelectButtonProps {
  label: string;
  leftIcon?: any;
  rightIcon?: any;
  onFileSelected: (fileList: FileList) => void;
}

type P = TrackSelectButtonProps & WithTheme;

const TrackSelectButton: FC<P> = (props) => {
  const {
    label,
    leftIcon,
    rightIcon,
    onFileSelected,
    theme,
    ...others
  } = props;

  const StyledLabel = styled.span`
    margin: ${theme.spacing(1)};
  `;

  return (
    <SelectableButton
      accept="audio/*"
      multiple={true}
      onSelected={onFileSelected}
      {...others}
    >
      {leftIcon}
      <StyledLabel>{label}</StyledLabel>
      {rightIcon}
    </SelectableButton>
  );
};

export default withTheme(TrackSelectButton);
