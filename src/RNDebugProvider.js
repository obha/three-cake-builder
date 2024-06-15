import { createContext, useCallback, useContext, useLayoutEffect } from "react";
import store from "./store";

const RNDebugContext = createContext({ emit: () => {} });

export const useRNDebug = () => useContext(RNDebugContext);

export default function RNDebugProvider({ children }) {
  const emit = (message) => {
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  };

  const handleOnEvent = useCallback((event) => {
    try {
      const eventData = event.data;
      if (Object.keys(eventData).length === 0) {
        return;
      }
    } catch (error) {
      emit({ tag: "Error", message: JSON.stringify(error) });
    }
  }, []);

  useLayoutEffect(() => {
    return store.subscribe(() => {
      emit({ tag: "DebugMessage", message: JSON.stringify(store.getState()) });
    });
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("message", handleOnEvent);

    emit({ tag: "MapComponentMounted", version: "1.0.2" });

    return () => {
      window.removeEventListener("message", handleOnEvent);
    };
  }, [handleOnEvent]);

  return (
    <RNDebugContext.Provider value={{ emit }}>
      {children}
    </RNDebugContext.Provider>
  );
}
