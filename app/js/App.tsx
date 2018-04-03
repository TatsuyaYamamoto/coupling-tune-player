import * as React from "react";
import {Provider} from "react-redux";

import {store} from "./modules/redux";

import Index from "./components/pages/Index";

const App = () => (
  <Provider store={store}>
    <Index/>
  </Provider>
);

export default App;
