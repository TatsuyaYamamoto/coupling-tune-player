import * as React from "react";

import Button from "material-ui/Button";
import Icon from "material-ui-icons/Pause";

interface Props {
  onClick?: () => void;
}

const PauseButton = (props: Props) => {
  const {
    onClick,
    ...other,
  } = props;

  return (
    <Button
      variant="fab"
      onClick={onClick}
      {...other}
    >
      <Icon/>
    </Button>
  );
};

export default PauseButton;
