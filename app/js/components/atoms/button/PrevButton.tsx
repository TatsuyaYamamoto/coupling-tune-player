import * as React from "react";

import Button, { ButtonProps } from "material-ui/Button";
import { SkipPrevious } from "material-ui-icons";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const PrevButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <Button variant="fab" color="primary" onClick={onClick} {...other}>
      <SkipPrevious />
    </Button>
  );
};

export default PrevButton;
