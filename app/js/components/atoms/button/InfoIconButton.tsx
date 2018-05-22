import * as React from "react";

import Icon from "material-ui-icons/InfoOutline";
import IconButton from "material-ui/IconButton";
import { MouseEvent } from "react";

export interface Props {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const InfoIconButton = (props: Props) => {
  const { onClick } = props;

  return (
    <IconButton onClick={onClick} color="inherit">
      <Icon />
    </IconButton>
  );
};

export default InfoIconButton;
