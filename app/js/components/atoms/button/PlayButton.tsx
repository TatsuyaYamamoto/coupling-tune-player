import * as React from "react";

import Button, { ButtonProps } from "material-ui/Button";
import Icon from "material-ui-icons/PlayArrow";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const PlayButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <Button variant="fab" color="primary" onClick={onClick} {...other}>
      <Icon />
    </Button>
  );
};

export default PlayButton;
