import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import "./api";
import store from "./store";
import "./styles.css";
import RNDebugProvider from "./RNDebugProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RNDebugProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </RNDebugProvider>
  </React.StrictMode>
);
