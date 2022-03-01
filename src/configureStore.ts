import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

export default function configureStore() {
  return createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
        : (f: Function) => f
    )
  );
}
