import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

import { CouplingPlayer } from "@coupling-tune-player/share";

import { readAsArrayBuffer } from "../../utils/mainProcessBridge";

const couplingPlayer = new CouplingPlayer();

type PlayerState = "playing" | "pausing" | "unavailable";

interface PlayerContext {
  state: PlayerState;
  play: () => void;
  pause: () => void;
  setTracks: (filePaths: string[]) => void;
}

const PlayerContext = createContext<PlayerContext>({
  state: "unavailable",
  play: () => {},
  pause: () => {},
  setTracks: () => {},
});

export const PlayerRoot: FC = (props) => {
  const { children } = props;
  const [state, setState] = useState<PlayerState>("unavailable");
  const [trackFilePaths, setTrackFilePaths] = useState<string[]>([]);

  const play = async () => {
    console.log("usePlayer#play", trackFilePaths);
    const buffers = await Promise.all(
      trackFilePaths.map((path) => readAsArrayBuffer(path))
    );
    return couplingPlayer.play(buffers.map((b) => b.buffer));
  };
  const pause = () => {
    couplingPlayer.pause();
  };

  const setTracks = (filePaths: string[]) => {
    setTrackFilePaths(filePaths);
  };

  useEffect(() => {
    const handlePlay = () => {
      setState("playing");
    };
    const handlePause = () => {
      setState("pausing");
    };

    couplingPlayer.on("play", handlePlay);
    couplingPlayer.on("pause", handlePause);
    return () => {
      couplingPlayer.off("play", handlePlay);
      couplingPlayer.off("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    if (trackFilePaths.length === 2) {
      setState("pausing");
    } else {
      setState("unavailable");
    }
  }, [trackFilePaths]);

  return (
    <PlayerContext.Provider value={{ state, play, pause, setTracks }}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  return useContext(PlayerContext);
};

export default usePlayer;
