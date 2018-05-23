import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";

import player, { PlayerState } from "./player";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers<States>({
    player
  }),
  composeEnhancers(applyMiddleware(reduxThunk))
);

export interface States {
  player: PlayerState;
}
