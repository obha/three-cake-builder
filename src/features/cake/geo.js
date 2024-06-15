import * as THREE from "three";
import { ADDITION, Brush, Evaluator } from "three-bvh-csg";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

class Accumulator {
  value = 0;

  set(part) {
    if (part)
      this.value += (part.base.layers * 2 + 1) * part.base.layerThikness;
    else this.value = 0;
    return this.value;
  }
}

export class CakeGeometry extends THREE.BufferGeometry {
  evaluator = new Evaluator();
  nextLayerPos = new Accumulator();
  height = new Accumulator();
  baseBrush = new Brush(new THREE.BoxGeometry(0, 0, 0));

  constructor(layers = [], scaleCoff = 1) {
    super();
    this.layers = layers;
    this.scaleCoff = scaleCoff;
    this.type = "CakeGeometry";
    this.evaluator.useGroups = true;
  }

  getBoundingBox() {
    this.baseBrush.geometry.computeBoundingBox();
    return this.baseBrush.geometry.boundingBox;
  }

  setScaleCoff(value) {
    this.scaleCoff = value;
  }

  createShapeGeometry(depth, material) {}

  draw() {
    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      try {
        this.height.set(this.layers[layerIndex]);

        const layers = this.layers[layerIndex].base.layers * 2 + 1;
        const depth = layers * this.layers[layerIndex].base.layerThikness;
        const scaleOffset =
          this.scaleCoff + layerIndex * -this.layers[layerIndex].base.offset;
        const nextLayerPos = this.nextLayerPos.set(this.layers[layerIndex - 1]);

        const shapeBrush = this.createShapeGeometry(
          depth,
          this.layers[layerIndex].base.mat.outer
        );

        // this.layers[layerIndex].base.mat.outer;

        shapeBrush.scale.set(scaleOffset, scaleOffset, 1);
        shapeBrush.translateZ(this.height.value - nextLayerPos - depth / 2);
        shapeBrush.updateMatrixWorld();

        this.baseBrush = this.evaluator.evaluate(
          this.baseBrush,
          this.resolve(shapeBrush),
          ADDITION
        );
      } catch (error) {
        console.log(error);
      }
    }

    this.baseBrush.geometry.computeBoundsTree();
    this.baseBrush.geometry.computeBoundingBox();

    const size = new THREE.Vector3();
    this.getBoundingBox().getSize(size);
    size.x = Math.min(this.scaleCoff, this.scaleCoff / size.x);
    size.y = Math.min(this.scaleCoff, this.scaleCoff / size.y);

    this.baseBrush.geometry.scale(size.x, size.y, 1);

    for (let attr in this.baseBrush.geometry.attributes) {
      this.setAttribute(attr, this.baseBrush.geometry.attributes[attr]);
    }
  }

  resolve(op) {
    let currentOp = null;
    if (op instanceof Brush) {
      op.updateMatrixWorld();
      currentOp = op;
    } else {
      op.traverse((obj) => {
        obj.updateMatrixWorld();
        if (!currentOp && obj instanceof Brush) currentOp = obj;
      });
    }
    return currentOp;
  }
}

export class SVGCakeGeometry extends CakeGeometry {
  constructor(layers = [], svg, extrusionOptions) {
    super(layers);
    this.type = "SVGCakeGeometry";
    this.svg = svg;
    this.extrusionOptions = extrusionOptions;
    this.evaluator.useGroups = true;
    this.draw();
  }

  createShapeGeometry(depth, mat) {
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
