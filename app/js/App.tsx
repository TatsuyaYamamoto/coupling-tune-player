import * as React from "react";
import {Fragment} from "react";
import {Provider} from "react-redux";

import {CssBaseline} from "material-ui";

import {store} from "./modules/redux";

import Index from "./components/pages/Index";

const App = () => (
  <Fragment>
    <CssBaseline/>
    <Provider store={store}>
      <Index/>
    </Provider>
  </Fragment>
);

export default App;
