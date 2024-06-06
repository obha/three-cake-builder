import { forwardRef, useMemo, useRef } from "react";
import * as THREE from "three";

const PartialCutterGeometry = forwardRef(function Parial(
  { radius = 1, depth = 1 },
  ref
) {
  const geometry = useRef(ref);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    for (let i = (3 * Math.PI) / 2; i < 2 * Math.PI; i += 0.1) {
      const x = radius * Math.cos(i);
      const y = radius * Math.sin(i);
      s.lineTo(x, y);
    }
    return s;
  }, [radius]);

  const config = useMemo(() => ({ depth, bevelEnabled: false }), [depth]);

  return <extrudeGeometry ref={geometry} args={[shape, config]} />;
});

export default PartialCutterGeometry;
