import { FC, useEffect } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";

import { Provider } from "react-redux";

import {
  colors,
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import { createStore } from "../src/redux/store";
import { pageview } from "../src/helper/gtag";

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
        backgroundColor: "#FAFAFA",
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
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>{process.env.title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={process.env.description} />

        <link rel="shortcut icon" href="/images/favicon.ico" />

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
