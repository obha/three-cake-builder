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

/**
 * @param {THREE.Object3D} root
 * @param {THREE.Object3D} node
 */
export function getRootNode(root, node) {
  if (node.parent === null || node.parent.uuid === root.uuid) {
    return node;
  }

  let parent = node.parent;
  while (parent.parent.uuid !== root.uuid) {
    parent = parent.parent;
  }

  return parent;
}
