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
    this.evaluator.useGroups = true;
    this.draw();
  }

  protected createShapeGeometry(
    depth: number,
    material?: THREE.Material
  ): Brush {
    let base = new Brush(new THREE.BoxGeometry(0, 0, 0));

    for (let pathIndex in this.svg.paths) {
      const extrusionGeom = new THREE.ExtrudeGeometry(
        SVGLoader.createShapes(this.svg.paths[pathIndex]),
        { ...this.extrusionOptions, depth }
      );

      const b = new Brush(extrusionGeom.center(), material);

      b.updateMatrixWorld(true);
      console.log(b.scale);

      b.scale.set(1, 1, 1);

      base = this.evaluator.evaluate(base, b, ADDITION);
    }

    return base;
  }
}
