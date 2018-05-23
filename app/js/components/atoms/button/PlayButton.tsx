import * as React from "react";

import Button, { ButtonProps } from "material-ui/Button";
import { PlayArrow } from "material-ui-icons";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const PlayButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <Button variant="fab" color="primary" onClick={onClick} {...other}>
      <PlayArrow />
    </Button>
  );
};

export default PlayButton;
