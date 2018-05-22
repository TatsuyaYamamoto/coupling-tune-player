import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import player, { PlayerState } from "./player";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers<States>({
    player
  }),
  composeEnhancers(applyMiddleware(thunk))
);

export interface States {
  player: PlayerState;
}
