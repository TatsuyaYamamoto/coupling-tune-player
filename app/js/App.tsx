import * as React from "react";
import { Fragment } from "react";
import { Provider } from "react-redux";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import * as colors from "material-ui/colors";
import { CssBaseline } from "material-ui";

import { store } from "./modules/redux";

import Index from "./components/pages/Index";

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: colors.orange[100],
      main: colors.orange[300],
      dark: colors.orange[700],
      contrastText: colors.grey.A700
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000"
    }
  }
});

const App = () => (
  <Fragment>
    <CssBaseline />
    <Provider store={store}>
      <MuiThemeProvider theme={muiTheme}>
        <Index />
      </MuiThemeProvider>
    </Provider>
  </Fragment>
);

export default App;
