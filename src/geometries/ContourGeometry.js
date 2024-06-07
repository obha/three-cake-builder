import { Addition, Base, Geometry } from "@react-three/csg";
import { useMemo } from "react";
import * as THREE from "three";
export default function ContourGeometry({
  radius = 1,
  height = 0,
  angle = 15,
  children,
}) {
  const coords = useMemo(() => {
    const points = [];
    for (let deg = 0; deg < 360; deg += angle) {
      const x = radius * Math.cos(THREE.MathUtils.degToRad(deg));
      const y = radius * Math.sin(THREE.MathUtils.degToRad(deg));
      points.push([x, y]);
    }
    return points;
  }, [radius, angle]);

  return (
    <Geometry>
      <Base>
        <sphereGeometry args={[0]} />
      </Base>
      {coords.map(([x, y], index) => {
        return (
          <Addition key={index} position={[x, y, height]}>
            {children}
          </Addition>
        );
      })}
    </Geometry>
  );
}
