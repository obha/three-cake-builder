import * as THREE from "three";
/**
 *
 * @param {THREE.ShapePath} path
 */
export function convertShapePathToSpline(path, divisions = 3) {
  const points = path.subPaths.reduce((prev, currentPath) => {
    const paths = currentPath.curves.reduce((prev, currentCurve) => {
      if (currentCurve instanceof THREE.CubicBezierCurve) {
      } else if (currentCurve instanceof THREE.EllipseCurve) {
      }

      prev.push(...currentCurve.getPoints(divisions));
      return prev;
    }, []);

    prev.push(...paths);

    return prev;
  }, []);

  return new THREE.SplineCurve(points);
}
