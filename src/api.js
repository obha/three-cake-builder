import cakeSlice from "./components/Cake/cakeSlice";
import { loadPlacementObject } from "./containers/cakeSceneSlice";
import store from "./store";
window.cakeApi = {
  setSvgShape: (path) =>
    store.dispatch(cakeSlice.actions.setShapeSvgPath(path)),
  setPlacementObject: (path) => store.dispatch(loadPlacementObject(path)),
  getState: store.getState,
};
