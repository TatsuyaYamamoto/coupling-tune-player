import {
  createStore as _createStore,
  combineReducers,
  applyMiddleware,
  Middleware,
  Store
} from "redux";
import reduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";

import player, { PlayerState } from "./modules/player";
import audiolist, { AudioListState } from "./modules/audiolist";

const logger = createLogger({
  collapsed: true
});

export interface States {
  player: PlayerState;
  audiolist: AudioListState;
}

export function createStore(): Store<States> {
  const middlewares: Middleware[] = [reduxThunk];

  if (process.env.NODE_ENV !== "production") {
    middlewares.push(logger);
  }

  return _createStore(
    combineReducers<States>({
      player,
      audiolist
    }),
    applyMiddleware(...middlewares)
  );
}
