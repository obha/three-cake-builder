import * as sceneApi from "./features/scene/api";
import slice from "./features/scene/slice";

export default function Api(store) {
  function setSvgShape(svg) {
    store.dispatch(slice.actions.setSvgShape(svg));
  }
  function setPlacementObject(path) {
    store.dispatch(sceneApi.loadPlacementObject(path));
  }
  function deleteSelectedObject() {
    store.dispatch(slice.actions.setSelectedObject(null));
  }
  function updateLayerById(id, layer) {
    store.dispatch(slice.actions.updatePart({ id, layer }));
  }
  // animate: function () {
  //   let offset = 0.1;
  //   let interval;
  //   const stop = () => {
  //     if (interval) {
  //       clearInterval(interval);
  //       interval = null;
  //     }
  //   };

  //   const start = () => {
  //     if (!interval) {
  //       interval = setInterval(() => {
  //         offset += 0.01;
  //         this.updateLayerById(1, { base: { offset } });
  //         if (offset >= 1) {
  //           stop();
  //         }
  //       }, 100);
  //     }
  //   };

  //   return {
  //     start,
  //     stop,
  //   };
  // },

  return {
    setSvgShape,
    updateLayerById,
    setPlacementObject,
    deleteSelectedObject,
  };
}

// window.cakeApi = api;
