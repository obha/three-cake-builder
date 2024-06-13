import * as THREE from "three";
import { ADDITION, Brush } from "three-bvh-csg";
import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader";
import CakeGeometry from "./CakeGeometry";

export default class SVGCakeGeometry extends CakeGeometry {
  constructor(
    layers: any[],
    private readonly svg: SVGResult,
    private readonly extrusionOptions: THREE.ExtrudeGeometryOptions
  ) {
    super(layers);
    this.type = "SVGCakeGeometry";
    this.svg = svg;
    this.extrusionOptions = extrusionOptions;
    this.draw();
  }

  protected createShapeGeometry(depth: number, mat?: THREE.Material): Brush {
    let base = new Brush(new THREE.BoxGeometry(0, 0, 0));

    for (let pathIndex in this.svg.paths) {
      const extrusionGeom = new THREE.ExtrudeGeometry(
        SVGLoader.createShapes(this.svg.paths[pathIndex]),
        { ...this.extrusionOptions, depth }
      );

      const op = new Brush(extrusionGeom.center(), mat);

      op.updateMatrixWorld();

      base = this.evaluator.evaluate(base, op, ADDITION);
    }

    return base;
  }
}
