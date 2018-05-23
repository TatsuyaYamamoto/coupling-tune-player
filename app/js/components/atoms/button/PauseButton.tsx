import * as React from "react";

import { Button } from "material-ui";
import { Pause } from "material-ui-icons";

interface Props {
  onClick?: () => void;
}

const PauseButton = (props: Props) => {
  const { onClick, ...other } = props;

  return (
    <Button variant="fab" color="primary" onClick={onClick} {...other}>
      <Pause />
    </Button>
  );
};

export default PauseButton;
