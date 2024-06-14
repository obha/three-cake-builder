import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import SVGCakeGeometry from "../../geometries/SVGCakeGeometry";

const CakeMesh = forwardRef(function CakeMesh(
  { svg, layers, children, computeVertexNormals = false, ...otherProps },
  ref
) {
  const svgResutl = useMemo(() => new SVGLoader().parse(svg), [svg]);

  const mesh = useMemo(() => {
    const geom = new SVGCakeGeometry(layers, svgResutl, {
      bevelEnabled: false,
      bevelSize: 0.1,
      bevelThickness: 0.01,
      bevelSegments: 3,
    });

    geom.computeVertexNormals();

    return new THREE.Mesh(geom);
  }, [layers, svgResutl]);

  return (
    <primitive ref={ref} object={mesh} {...otherProps}>
      {children}
    </primitive>
  );
});

export default CakeMesh;
