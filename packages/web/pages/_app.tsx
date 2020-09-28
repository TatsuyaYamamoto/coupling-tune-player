import React, { FC } from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";

import {
  colors,
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { createStore } from "../src/redux/store";

import "rc-slider/assets/index.css";

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: colors.orange[100],
      main: colors.orange[300],
      dark: colors.orange[700],
      contrastText: colors.grey.A700,
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const store = createStore();

const MyApp: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <Component {...pageProps} />
        </MuiThemeProvider>
      </Provider>
    </>
  );
};

export default MyApp;
