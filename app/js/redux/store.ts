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
import tracklist, { TrackListState } from "./modules/tracklist";

const logger = createLogger({
  collapsed: true
});

export interface States {
  player: PlayerState;
  tracklist: TrackListState;
}

export function createStore(): Store<States> {
  const middlewares: Middleware[] = [reduxThunk];

  if (process.env.NODE_ENV !== "production") {
    middlewares.push(logger);
  }

  return _createStore(
    combineReducers<States>({
      player,
      tracklist
    }),
    applyMiddleware(...middlewares)
  );
}
