import { createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import { merge } from "../../common/utils";

const defaultMaterials = {
  outer: new THREE.MeshToonMaterial(),
  inner: new THREE.MeshToonMaterial(),
};

const defaultLayers = [
  {
    base: {
      offset: 0,
      layers: 2,
      layerThikness: 0.1,
      mat: defaultMaterials,
    },
  },
  {
    base: {
      offset: 0.3,
      layers: 3,
      layerThikness: 0.1,
      mat: defaultMaterials,
    },
  },
  {
    base: {
      offset: 0.3,
      layers: 4,
      layerThikness: 0.1,
      mat: defaultMaterials,
    },
  },
];

export default createSlice({
  name: "scene",
  initialState: {
    placementObject: null,
    selectedObject: null,
    svgShape:
      '<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1Z" fill="#D9D9D9" /></svg>',
    layers: defaultLayers,
  },
  reducers: {
    setPlacementObject(state, action) {
      state.placementObject = action.payload;
    },
    setSelectedObject(state, action) {
      state.selectedObject = action.payload;
    },
    addPart(state, action) {
      state.layers.push(action.payload);
    },
    deletePart(state, action) {
      state.layers = state.layers.filter((_, id) => action.payload.id !== id);
    },
    updatePart(state, action) {
      state.layers = state.layers.map((layer, id) => {
        if (action.payload.id === id) {
          return merge(layer, action.payload.layer);
        }
        return layer;
      });
    },
    setSvgShape(state, action) {
      state.svgShape = action.payload;
    },
  },
});
