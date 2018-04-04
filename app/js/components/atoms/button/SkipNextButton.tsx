import * as React from "react";

import Button, {ButtonProps} from "material-ui/Button";
import Icon from "material-ui-icons/SkipNext";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const SkipNextButton = (props: Props) => {
  const {
    onClick,
    ...other,
  } = props;

  return (
    <Button
      variant="fab"
      mini={true}
      onClick={onClick}
      {...other}
    >
      <Icon/>
    </Button>
  );
};

export default SkipNextButton;
