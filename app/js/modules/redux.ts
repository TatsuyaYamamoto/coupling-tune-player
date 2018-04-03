import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";

import player, {PlayerState} from "./player";

export const store = createStore(
  combineReducers<States>({
    player,
  }),
  applyMiddleware(thunk),
);

export interface States {
  player: PlayerState;
}
