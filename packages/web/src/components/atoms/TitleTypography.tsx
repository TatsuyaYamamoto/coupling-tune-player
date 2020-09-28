import React, { FC } from "react";
import { Typography } from "@material-ui/core";

const TitleTypography: FC = props => {
  return (
    <Typography
      variant="h4"
      color="inherit"
      style={{ fontFamily: "Nico Moji" }}
    >
      {props.children}
    </Typography>
  );
};

export default TitleTypography;
