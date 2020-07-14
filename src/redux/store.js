import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import lotes from "./LoteDuck.js";
import user from "./UserDuck.js";
import ventas from "./VentaDuck.js"

export const rootReducer = combineReducers({
  lotes,
  user,
  ventas,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
