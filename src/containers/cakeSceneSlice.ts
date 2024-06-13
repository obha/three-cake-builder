import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

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

export const { setPlacementObject, setSelectedObject } = slice.actions;

export function loadPlacementObject(
  path: string,
  onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined
) {
  const loader = new GLTFLoader();

  return async (dispatch: Dispatch) => {
    try {
      const gltf = await new Promise<GLTF>((resolve, reject) =>
        loader.load(path, resolve, onProgress, (e) => reject(e.error))
      );

      const size = new THREE.Vector3();

      new THREE.Box3().setFromObject(gltf.scene, true).getSize(size);

      gltf.scene.scale.set(
        Math.min(0.3, 0.3 / size.x),
        Math.min(0.3, 0.3 / size.y),
        Math.min(0.3, 0.3 / size.z)
      );

      dispatch(setPlacementObject(gltf.scene));
    } catch (error) {
      console.log(error);
    }
  };
}

export default slice;
