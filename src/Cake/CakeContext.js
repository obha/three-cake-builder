import { createContext, useContext } from "react";
import * as THREE from "three";
import cakeInsideTexture from "../textures/cakeInsideTexture";

const cakeOuterMaterial = (color) => {
  return new THREE.MeshToonMaterial({ color });
};

const createCakeInnerMaterial = () => {
  return (layers, thikness) =>
    new THREE.MeshToonMaterial({
      map: cakeInsideTexture(layers, thikness, 256, 256),
    });
};

export const DEFAULT_CAKE = {
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
};

const CakeContext = createContext(DEFAULT_CAKE);

export const useCake = () => useContext(CakeContext);

export const CakeProvider = CakeContext.Provider;
export const CakeConsumer = CakeContext.Consumer;
