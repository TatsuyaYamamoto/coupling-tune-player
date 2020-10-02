import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { CouplingPlayer } from "@coupling-tune-player/share";

import { readAsArrayBuffer } from "../../utils/mainProcessBridge";

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
  const player = useRef<CouplingPlayer | null>(null);

  const play = async () => {
    console.log("usePlayer#play", trackFilePaths);
    if (!player.current) {
      console.error("coupling-player is not initialized.");
      return;
    }

    await player.current.play();
    setDuration(player.current.duration);
  };

  const pause = () => {
    if (!player.current) {
      console.error("coupling-player is not initialized.");
      return;
    }

    player.current.pause();
  };

  const setTracks = (filePaths: string[]) => {
    if (!player.current) {
      console.error("coupling-player is not initialized.");
      return;
    }

    setTrackFilePaths(filePaths);
  };

  const updateCurrentTime = (newCurrentValue: number) => {
    if (!player.current) {
      console.error("coupling-player is not initialized.");
      return;
    }

    player.current.currentTime = newCurrentValue;
  };

  useEffect(() => {
    const handlePlay = () => {
      console.log("on play");
      setState("playing");
    };
    const handlePause = () => {
      console.log("on pause");
      setState("pausing");
    };

    const handleUpdate = (args: any) => {
      setCurrent(args.currentTime);
    };

    (async () => {
      const buffers = await Promise.all(
        trackFilePaths.map((path) => readAsArrayBuffer(path))
      );
      player.current = new CouplingPlayer(buffers);
      player.current.on("play", handlePlay);
      player.current.on("pause", handlePause);
      player.current.on("update", handleUpdate);

      if (2 <= trackFilePaths.length) {
        setState("pausing");
      } else {
        setState("unavailable");
      }
    })();

    return () => {
      if (player.current) {
        if (player.current.playing) {
          player.current.pause();
        }

        player.current.off("play");
        player.current.off("pause");
        player.current.off("update");
      }
    };
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
