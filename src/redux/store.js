import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import lotes from "./LoteDuck.js";
import user from "./AuthDuck.js";
import users from "./UserDuck.js";
import ventas from "./VentaDuck.js"
import pagos from "./PagoDuck.js"

export const rootReducer = combineReducers({
  lotes,
  user,
  users,
  ventas,
  pagos,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
