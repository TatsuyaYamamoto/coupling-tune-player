import * as React from "react";

import IconButton, { IconButtonProps } from "material-ui/IconButton";
import { SkipNext } from "material-ui-icons";

interface Props extends IconButtonProps {
  onClick?: () => void;
}

const NextButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <IconButton color="primary" onClick={onClick} {...other}>
      <SkipNext />
    </IconButton>
  );
};

export default NextButton;
