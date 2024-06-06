import * as THREE from "three";
/**
 *
 * @param {THREE.ShapePath} path
 */
export function convertShapePathToSpline(path, divisions = 3) {
  const points = path.currentPath.curves.reduce((prev, currentCurve) => {
    prev.push(...currentCurve.getPoints(divisions));

    return prev;
  }, []);

  return new THREE.SplineCurve(points);
}
