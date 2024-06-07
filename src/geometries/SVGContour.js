import { useMemo } from "react";

import * as THREE from "three";
import { mergeBufferGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { convertShapePathToSpline } from "../utils";

export default function SVGContour({ svg, division = 2 }) {
  const combinedGeometries = useMemo(() => {
    const sphereTemplate = new THREE.InstancedBufferGeometry().copy(
      new THREE.SphereGeometry(0.05)
    );
    const geometries = svg.paths
      .map((path) => convertShapePathToSpline(path, division))
      .reduce((prev, spline) => {
        const geoms = spline.points.map((point) => {
          const node = sphereTemplate.clone();
          node.translate(-0.5 + point.x, -0.5 + point.y, 0);
          return node;
        });
        prev.push(...geoms);
        return prev;
      }, []);

    return mergeBufferGeometries(geometries);
  }, [svg, division]);

  return <primitive object={combinedGeometries} />;
}
