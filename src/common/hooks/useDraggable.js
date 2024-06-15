import { useThree } from "@react-three/fiber";
import useMouseEvents from "./useMouseEvents";
import { useRef } from "react";

export default function useDraggable() {
  const intersectRef = useRef(null);
  const { controls } = useThree();

  const events = useMouseEvents();
  const start = events.add(
    "mousedown",
    /**
     *
     * @param {THREE.Intersection<THREE.Object3D>} intersect
     */
    (intersect) => {
      intersectRef.current = intersect;
      controls.enabled = false;
    }
  );

  const end = events.add(
    "mouseup",
    /**
     *
     * @param {THREE.Intersection<THREE.Object3D>} intersect
     */
    (intersect) => {
      intersectRef.current = null;
      controls.enabled = true;
    }
  );

  const move = (handler) =>
    events.add(
      "mousemove",
      /**
       *
       * @param {THREE.Intersection<THREE.Object3D>} intersect
       */
      (intersect) => {
        if (intersectRef.current !== null) {
          handler?.(intersect);
        }
      }
    );

  return (object, handler) => {
    if (object) {
      const subscribes = [start(object), end(object), move(handler)(object)];

      return () => {
        subscribes.forEach((s) => s());
      };
    }
  };
}
