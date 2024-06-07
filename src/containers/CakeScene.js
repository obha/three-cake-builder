import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useCake } from "../components/Cake/CakeContext";
import CakeGeometry from "../components/Cake/CakeGeometry";

export default function CakeScene() {
  const { raycaster, scene } = useThree();
  const ctx = useCake();

  const { scene: flowerScene } = useGLTF(
    "/assets/models/lowpoly_hibiscus_flower.glb"
  );

  const collisionBoxes = useRef([]);

  /**
   *
   * @param {THREE.Box3} box
   * @returns {boolean}
   */
  const hasCollision = (box) => {
    return collisionBoxes.current.reduce((prev, currentBox) => {
      return prev || currentBox.intersectsBox(box);
    }, false);
  };

  /**
   *
   * @param {import("@react-three/fiber").ThreeEvent<MouseEvent>} event
   */
  const addObject = ({ object }) => {
    const intersect = raycaster.intersectObject(object)[0];

    if (ctx.cake.placementObject) {
      const normal = intersect.object
        .localToWorld(intersect.face.normal)
        .normalize();

      const instance = ctx.cake.placementObject.clone();

      instance.lookAt(normal);

      instance.position.set(
        intersect.point.x,
        intersect.point.y,
        intersect.point.z
      );

      const boundingBox = new THREE.Box3().setFromObject(instance, true);

      if (hasCollision(boundingBox)) {
        return;
      }

      collisionBoxes.current.push(boundingBox);
      scene.add(instance);
    }
  };

  useLayoutEffect(() => {
    // const geo = new THREE.BoxGeometry(0.1);
    // const mat = new THREE.MeshBasicMaterial();
    // const mesh = new THREE.Mesh(geo, mat);
    flowerScene.scale.set(0.5, 0.5, 0.5);
    ctx.setCake({ placementObject: flowerScene });
  }, [ctx, flowerScene]);

  return (
    <mesh
      castShadow
      position={[0, 0, 0]}
      onClick={addObject}
      rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
    >
      <CakeGeometry partial />
    </mesh>
  );
}
