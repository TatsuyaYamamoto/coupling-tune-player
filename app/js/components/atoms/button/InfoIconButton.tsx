import * as React from "react";

import { IconButton } from "@material-ui/core";
import { InfoOutline as Icon } from "@material-ui/icons";

export interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
