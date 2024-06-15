import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import Api from "./api";
import slice from "./features/scene/slice";

const logger = createLogger();

const store = configureStore({
  reducer: {
    scene: slice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

window.cakeApi = Api(store);

export const dispatch = store.dispatch;

export default store;
