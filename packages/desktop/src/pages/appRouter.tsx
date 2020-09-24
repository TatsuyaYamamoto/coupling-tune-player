/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, useState } from "react";

import LibraryPage from "./library";

type RenderingPage = "library";

const AppRouter: FC = () => {
  const [renderingView] = useState<RenderingPage>("library");

  return <div>{renderingView === "library" && <LibraryPage />}</div>;
};

export default AppRouter;
