import { Addition, Geometry } from "@react-three/csg";
import { useMemo } from "react";

import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

export default function SVGGeometry({ svg, depth }) {
  const config = useMemo(
    () => ({
      depth,
      bevelEnabled: false,
      bevelSize: 0.1,
      bevelThickness: 0.01,
      bevelSegments: 3,
    }),
    [depth]
  );

  return (
    <Geometry>
      {svg.paths.map((path, index) => {
        const geo = new THREE.ExtrudeGeometry(
          SVGLoader.createShapes(path),
          config
        );

        return (
          <Addition
            key={index}
            geometry={geo.center()}
            position={[-0.5, -0.5, 0]}
          />
        );
      })}
    </Geometry>
  );
}
