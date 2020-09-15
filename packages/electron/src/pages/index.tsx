import React from "react";
import { PlayerController } from "@coupling-tune-player/share";

const IndexPage = () => {
  return (
    <div>
      <h1>React Electron App</h1>
      <p>Welcome to your Electron application.</p>
      <PlayerController />
    </div>
  );
};

export default IndexPage;
