import * as THREE from "three";
import { ADDITION, Brush, Evaluator } from "three-bvh-csg";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

class Accumulator {
  value = 0;

  set(part: any) {
    if (part)
      this.value += (part.base.layers * 2 + 1) * part.base.layerThikness;
    else this.value = 0;
    return this.value;
  }
}

export default abstract class CakeGeometry extends THREE.BufferGeometry {
  protected evaluator = new Evaluator();
  private nextLayerPos = new Accumulator();
  private height = new Accumulator();
  private baseBrush = new Brush(new THREE.BoxGeometry(0, 0, 0));

  constructor(private readonly layers: any[] = [], protected scaleCoff = 1) {
    super();

    this.type = "CakeGeometry";
    this.evaluator.useGroups = true;
  }

  public getBoundingBox(): THREE.Box3 {
    this.baseBrush.geometry.computeBoundingBox();
    return this.baseBrush.geometry.boundingBox!;
  }

  public setScaleCoff(value: number) {
    this.scaleCoff = value;
  }

  protected abstract createShapeGeometry(
    depth: number,
    material?: THREE.Material
  ): Brush;

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

  private resolve(op: THREE.Object3D): Brush {
    let currentOp: THREE.Object3D = null!;
    if (op instanceof Brush) {
      op.updateMatrixWorld();
      currentOp = op;
    } else {
      op.traverse((obj) => {
        obj.updateMatrixWorld();
        if (!currentOp && obj instanceof Brush) currentOp = obj;
      });
    }
    return currentOp as Brush;
  }
}
