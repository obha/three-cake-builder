import { useThree } from "@react-three/fiber";
import { useCallback } from "react";
import * as THREE from "three";
import { getRootNode } from "../utils";

export default function useMouseEvents() {
  const { camera, scene, raycaster } = useThree();

  const add = useCallback(
    (eventType, onIntersection) => {
      const mouse = new THREE.Vector2();

      /**
       *
       * @param {THREE.Intersection<THREE.Object3D>} event
       */
      return (object) => {
        let intersection;
        /**
         *
         * @param {MouseEvent} event
         */
        const handler = (event) => {
          event.stopPropagation();

          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          if (object) {
            intersection = raycaster
              .intersectObjects(scene.children)
              .map((node) => {
                node.object = getRootNode(scene, node.object);
                return node;
              })
              .find((el) => el.object.uuid === object.uuid);

            if (intersection) {
              onIntersection?.(intersection);
            }
          }
        };

        document.addEventListener(eventType, handler, false);

        return () => {
          document.removeEventListener(eventType, handler, false);
        };
      };
    },
    [camera, raycaster, scene]
  );

  return { add };
}
