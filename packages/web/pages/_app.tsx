import { FC, useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

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
  typography: {
    fontFamily: [
      '"Rounded Mplus 1c"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
    ].join(","),
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#FAFAFA"
      },
    },
  },
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

  useEffect(() => {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      // @ts-ignore
      window.dataLayer.push(arguments);
    }
    // @ts-ignore
    window.gtag = gtag;

    // @ts-ignore
    gtag("js", new Date());
    // @ts-ignore
    gtag("config", "<%= trackingCode %>");
  }, []);

  return (
    <>
      <Head>
        <title>かぷちゅうプレイヤー / Coupling Tune Player</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />

        {/* Global site tag (gtag.js) - Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=<%= trackingCode %>"
        ></script>

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/earlyaccess/nicomoji.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          integrity="sha384-vp86vTRFVJgpjF9jiIGPEEqYqlDwgyBgEF109VFjmqGmIY/Y4HV4d3Gp2irVfcrp"
          crossOrigin="anonymous"
        />
      </Head>
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </Provider>
    </>
  );
};

export default MyApp;
