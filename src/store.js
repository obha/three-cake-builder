import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import cakeSlice from "./components/Cake/cakeSlice";
import cakeSceneSlice, {
  loadPlacementObject,
} from "./containers/cakeSceneSlice";

const logger = createLogger();

const store = configureStore({
  reducer: {
    cake: cakeSlice.reducer,
    scene: cakeSceneSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: { extraArgument: { api: { loadPlacementObject } } },
    }).concat(logger),
});

export const dispatch = store.dispatch;

export default store;
