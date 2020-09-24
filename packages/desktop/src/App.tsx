import React from "react";
import { CssBaseline } from "@material-ui/core";
import { RecoilRoot } from "recoil";

import AppRouter from "./pages/appRouter";
import { PlayerRoot } from "./components/hooks/usePlayer";

const App = () => {
  return (
    <>
      <CssBaseline />
      <RecoilRoot>
        <PlayerRoot>
          <AppRouter />
        </PlayerRoot>
      </RecoilRoot>
    </>
  );
};

export default App;
