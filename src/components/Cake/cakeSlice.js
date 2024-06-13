import { createSlice } from "@reduxjs/toolkit";
import * as THREE from "three";
import cakeInsideTexture from "../../textures/cakeInsideTexture";

const cakeOuterMaterial = (color) => {
  return new THREE.MeshToonMaterial({ color });
};

const createCakeInnerMaterial = () => {
  return (layers, thikness) =>
    new THREE.MeshToonMaterial({
      map: cakeInsideTexture(layers, thikness, 256, 256),
    });
};

export default createSlice({
  name: "cake",
  initialState: {
    svgShapePath: "/assets/svg/8664845_face_grin_tongue_icon.svg",
    parts: [
      {
        base: {
          offset: 0,
          layers: 2,
          layerThikness: 0.1,
          mat: {
            outer: cakeOuterMaterial(0xffaa80),
            inner: createCakeInnerMaterial(),
          },
        },
      },
      {
        base: {
          offset: 0.3,
          layers: 3,
          layerThikness: 0.1,
          mat: {
            outer: cakeOuterMaterial(0xff5580),
            inner: createCakeInnerMaterial(),
          },
        },
      },
      {
        base: {
          offset: 0.2,
          layers: 6,
          layerThikness: 0.1,
          mat: {
            outer: cakeOuterMaterial(0xff0080),
            inner: createCakeInnerMaterial(),
          },
        },
      },
    ],
  },
  reducers: {
    addPart(state, action) {
      state.parts.push(action.payload);
    },
    deletePart(state, action) {
      state.parts = state.parts.filter((_, i) => i !== action.payload);
    },
    setShapeSvgPath(state, action) {
      state.svgShapePath = action.payload;
    },
  },
});
