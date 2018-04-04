import * as React from "react";

import Button, {ButtonProps} from "material-ui/Button";
import Icon from "material-ui-icons/SkipPrevious";

interface Props extends ButtonProps {
  onClick?: () => void;
}

const SkipPreviousButton = (props: Props) => {
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

export default SkipPreviousButton;
