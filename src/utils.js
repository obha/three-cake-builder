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

export function merge(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (typeof obj2[p] === "object") {
        obj1[p] = merge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }

  return obj1;
}
