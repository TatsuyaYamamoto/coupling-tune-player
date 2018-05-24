import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  Middleware
} from "redux";
import reduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";

import player, { PlayerState } from "./player";

const logger = createLogger({
  collapsed: true
});

const middlewares: Middleware[] = [reduxThunk];

if (process.env.NODE_ENV !== "production") {
  middlewares.push(logger);
}

export const store = createStore(
  combineReducers<States>({
    player
  }),
  applyMiddleware(...middlewares)
);

export interface States {
  player: PlayerState;
}
