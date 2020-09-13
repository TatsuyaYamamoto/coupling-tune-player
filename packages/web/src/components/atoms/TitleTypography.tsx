import * as React from "react";
import { Typography } from "@material-ui/core";

const TitleTypography: React.SFC = props => {
  return (
    <Typography
      variant="title"
      color="inherit"
      style={{ fontFamily: "Nico Moji" }}
    >
      {props.children}
    </Typography>
  );
};

export default TitleTypography;
