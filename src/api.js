import cakeSlice from "./components/Cake/cakeSlice";
import { loadPlacementObject } from "./containers/cakeSceneSlice";
import store from "./store";

const { setShapeSvgPath, updatePart } = cakeSlice.actions;

window.cakeApi = {
  setSvgShape: function (path) {
    store.dispatch(setShapeSvgPath(path));
  },
  setPlacementObject: function (path) {
    store.dispatch(loadPlacementObject(path));
  },
  updateLayerById: function (id, layer) {
    store.dispatch(updatePart({ id, layer }));
  },
  animate: function () {
    let offset = 0.1;
    let interval;
    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const start = () => {
      if (!interval) {
        interval = setInterval(() => {
          offset += 0.01;
          this.updateLayerById(1, { base: { offset } });
          if (offset >= 1) {
            stop();
          }
        }, 100);
      }
    };

    return {
      start,
      stop,
    };
  },
};
