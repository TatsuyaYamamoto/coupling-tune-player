import React from "react";
import { CssBaseline } from "@material-ui/core";
import { RecoilRoot } from "recoil";

import Index from "./pages/Index";
import { PlayerRoot } from "./components/hooks/usePlayer";

const App = () => {
  return (
    <>
      <CssBaseline />
      <RecoilRoot>
        <PlayerRoot>
          <Index />
        </PlayerRoot>
      </RecoilRoot>
    </>
  );
};

export default App;
