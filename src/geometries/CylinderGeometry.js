import { useMemo } from "react";
import * as THREE from "three";

export default function CylinderGeometry({ radius = 1, depth = 1 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();

    s.arc(0, 0, radius, 0, 2 * Math.PI);
    return s;
  }, [radius]);

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

  return <extrudeGeometry args={[shape, config]} />;
}
