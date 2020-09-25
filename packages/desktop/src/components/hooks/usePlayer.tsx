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
  updateCurrentTime: (newCurrentValue: number) => void;
  duration: number;
  current: number;
  setTracks: (filePaths: string[], duration: number) => void;
}

const PlayerContext = createContext<PlayerContext>({
  state: "unavailable",
  play: () => {},
  pause: () => {},
  updateCurrentTime: () => {},
  duration: 0,
  current: 0,
  setTracks: () => {},
});

export const PlayerRoot: FC = (props) => {
  const { children } = props;
  const [state, setState] = useState<PlayerState>("unavailable");
  const [duration, setDuration] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [trackFilePaths, setTrackFilePaths] = useState<string[]>([]);

  const play = async (resetCurrentTime = false) => {
    console.log("usePlayer#play", trackFilePaths);
    const buffers = await Promise.all(
      trackFilePaths.map((path) => readAsArrayBuffer(path))
    );
    return couplingPlayer.play(buffers.map((b) => b.buffer));
  };

  const pause = () => {
    couplingPlayer.pause();
  };

  const setTracks = (filePaths: string[], duration: number) => {
    setTrackFilePaths(filePaths);
    setDuration(duration);
    couplingPlayer.updateCurrentTime(0);
  };

  const updateCurrentTime = (newCurrentValue: number) => {
    const stopOnce = couplingPlayer.playing;
    if (stopOnce) {
      pause();
    }
    couplingPlayer.updateCurrentTime(newCurrentValue);
    if (stopOnce) {
      play();
    }
  };

  useEffect(() => {
    const handlePlay = () => {
      setState("playing");
    };
    const handlePause = () => {
      setState("pausing");
    };

    const handleUpdate = (args: any) => {
      setCurrent(args.currentTime);
    };

    couplingPlayer.on("play", handlePlay);
    couplingPlayer.on("pause", handlePause);
    couplingPlayer.on("update", handleUpdate);
    return () => {
      couplingPlayer.off("play", handlePlay);
      couplingPlayer.off("pause", handlePause);
      couplingPlayer.off("update", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (couplingPlayer.playing) {
      pause();
    }

    if (2 <= trackFilePaths.length) {
      setState("pausing");
    } else {
      setState("unavailable");
    }
  }, [trackFilePaths]);

  return (
    <PlayerContext.Provider
      value={{
        state,
        play,
        pause,
        setTracks,
        duration,
        current,
        updateCurrentTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = () => {
  return useContext(PlayerContext);
};

export default usePlayer;
