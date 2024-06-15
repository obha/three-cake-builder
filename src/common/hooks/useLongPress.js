import { useRef } from "react";
import useMouseEvents from "./useMouseEvents";

export default function useLongPress(t = 1000) {
  const events = useMouseEvents();
  const timeout = useRef();

  const down = (handler) =>
    events.add("mousedown", (intersect) => {
      timeout.current = setTimeout(() => handler(intersect), t);
    });

  const up = events.add("mouseup", () => {
    timeout.current = null;
  });

  /**
   * @param {THREE.Object3D} object
   * @param {(intersect:THREE.Intersection<THREE.Object3D>)=>void} handler
   */
  return (object, handler) => {
    const s = [up(object), down(handler)(object)];
    return () => {
      s.forEach((s) => s());
    };
  };
}
