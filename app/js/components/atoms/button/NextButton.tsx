import * as React from "react";

import Button, { ButtonProps } from "material-ui/Button";
import { SkipNext } from "material-ui-icons";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const NextButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <Button variant="fab" color="primary" onClick={onClick} {...other}>
      <SkipNext />
    </Button>
  );
};

export default NextButton;
