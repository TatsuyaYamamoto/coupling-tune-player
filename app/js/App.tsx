import * as React from "react";
import { Provider } from "react-redux";

import {
  MuiThemeProvider,
  createMuiTheme,
  colors,
  CssBaseline
} from "@material-ui/core";

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
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <MuiThemeProvider theme={muiTheme}>
        <Index />
      </MuiThemeProvider>
    </Provider>
  </React.Fragment>
);

export default App;
