import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function useGizmoz() {
  const { scene } = useThree();
  /**
   *
   * @param {THREE.Vector3} a
   * @param {THREE.Vector3} b
   */
  const drawLine = (a, b) => {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  };
  return { drawLine };
}
