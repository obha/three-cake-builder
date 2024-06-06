import { useMemo } from "react";
import * as THREE from "three";

export default function HeartGeometry({ width = 1, height = 1, depth = 1 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const topCurveHeight = height * 0.2;
    const x = 0;
    const y = 0;

    s.moveTo(x, y + topCurveHeight);
    // top left curve
    s.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);

    // bottom left curve
    s.bezierCurveTo(
      x - width / 2,
      y + (height + topCurveHeight) / 2,
      x,
      y + (height + topCurveHeight) / 2,
      x,
      y + height
    );

    // bottom right curve
    s.bezierCurveTo(
      x,
      y + (height + topCurveHeight) / 2,
      x + width / 2,
      y + (height + topCurveHeight) / 2,
      x + width / 2,
      y + topCurveHeight
    );

    // top right curve
    s.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
    s.closePath();
    return s;
  }, [width, height]);

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
