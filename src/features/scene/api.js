import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import slice from "./slice";

const { setPlacementObject } = slice.actions;

/**
 *
 * @param {String} path
 * @param {(event:ProgressEvent<EventTarget>)=>void | undefined} onProgress
 * @returns
 */
export function loadPlacementObject(path, onProgress) {
  const loader = new GLTFLoader();
  /**
   * @param {Dispatch} dispatch
   */
  return async (dispatch) => {
    try {
      const gltf = await new Promise((resolve, reject) =>
        loader.load(path, resolve, onProgress, (e) => reject(e))
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
