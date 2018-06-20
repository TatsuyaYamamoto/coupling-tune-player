import * as React from "react";

import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import { SkipPrevious } from "@material-ui/icons";

interface Props extends IconButtonProps {
  onClick?: () => void;
}

const PrevButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <IconButton color="primary" onClick={onClick} {...other}>
      <SkipPrevious />
    </IconButton>
  );
};

export default PrevButton;
