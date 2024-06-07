import { createContext, useContext, useState } from "react";
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

export const DEFAULT_CAKE = {
  placementObject: null,
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

const CakeContext = createContext({
  cake: DEFAULT_CAKE,
  /**
   *
   * @param {typeof DEFAULT_CAKE} cake
   */
  setCake: (cake) => {},
});

export const useCake = () => useContext(CakeContext);

export const CakeProvider = ({ defauleValue = DEFAULT_CAKE, children }) => {
  const [state, setState] = useState(defauleValue);

  /**
   * @param {typeof DEFAULT_CAKE} cake
   */
  const setCake = (cake) => {
    setState((prev) => ({ ...prev, ...cake }));
  };

  return (
    <CakeContext.Provider value={{ cake: state, setCake }}>
      {children}
    </CakeContext.Provider>
  );
};
export const CakeConsumer = CakeContext.Consumer;
