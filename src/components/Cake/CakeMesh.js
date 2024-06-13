import SVGCakeGeometry from "../../geometries/SVGCakeGeometry";
import { useLoader } from "@react-three/fiber";
import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const CakeMesh = forwardRef(function CakeMesh(
  {
    svgShapePath,
    layers,
    children,
    computeVertexNormals = false,
    ...otherProps
  },
  ref
) {
  const svg = useLoader(SVGLoader, svgShapePath);

  const mesh = useMemo(() => {
    const geom = new SVGCakeGeometry(layers, svg, {
      bevelEnabled: false,
      bevelSize: 0.1,
      bevelThickness: 0.01,
      bevelSegments: 3,
    });

    geom.computeVertexNormals();

    return new THREE.Mesh(geom);
  }, [layers, svg]);

  return (
    <primitive ref={ref} object={mesh} {...otherProps}>
      {children}
    </primitive>
  );
});

export default CakeMesh;
