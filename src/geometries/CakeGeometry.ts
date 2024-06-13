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

  constructor(private readonly layers: any[] = []) {
    super();

    this.type = "CakeGeometry";
    this.evaluator.consolidateMaterials = true;
    this.evaluator.useGroups = true;
  }

  protected abstract createShapeGeometry(
    depth: number,
    material?: THREE.Material
  ): Brush;

  draw() {
    let baseBrush = new Brush(new THREE.BoxGeometry(0, 0, 0));

    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      try {
        this.height.set(this.layers[layerIndex]);

        const layers = this.layers[layerIndex].base.layers * 2 + 1;
        const depth = layers * this.layers[layerIndex].base.layerThikness;
        const scaleOffset =
          1 + layerIndex * -this.layers[layerIndex].base.offset;
        const nextLayerPos = this.nextLayerPos.set(this.layers[layerIndex - 1]);

        const shapeBrush = this.createShapeGeometry(
          depth,
          this.layers[layerIndex].base.mat.outer
        );

        shapeBrush.scale.set(scaleOffset, scaleOffset, 1);
        shapeBrush.position.set(0, 0, nextLayerPos);
        shapeBrush.updateMatrixWorld(true);

        baseBrush = this.evaluator.evaluate(baseBrush, shapeBrush, ADDITION);
      } catch (error) {
        console.log(error);
      }
    }

    baseBrush.geometry.computeBoundsTree();

    for (let attr in baseBrush.geometry.attributes) {
      this.setAttribute(attr, baseBrush.geometry.attributes[attr]);
    }
  }
}
