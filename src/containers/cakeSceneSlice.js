import { createSlice } from "@reduxjs/toolkit";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const slice = createSlice({
  name: "scene",
  initialState: {
    placementObject: null,
    selectedObject: null,
  },
  reducers: {
    setPlacementObject(state, action) {
      state.placementObject = action.payload;
    },
    setSelectedObject(state, action) {
      state.selectedObject = action.payload;
    },
  },
});

export function loadPlacementObject(path) {
  const loader = new GLTFLoader();

  return async (dispatch) => {
    try {
      const gltf = await new Promise((resolve, reject) =>
        loader.load(
          path,
          resolve,
          () => {},
          (e) => reject(e.error)
        )
      );

      dispatch(slice.actions.setPlacementObject(gltf.scene));
    } catch (error) {
      console.log(error);
    }
  };
}

export default slice;
