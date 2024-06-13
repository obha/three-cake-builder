import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";
import * as THREE from "three";
import CakeMesh from "../components/Cake/CakeMesh";
import useDraggable from "../hooks/useDraggable";
import useLongPress from "../hooks/useLongPress";
import useMouseEvents from "../hooks/useMouseEvents";
import { getRootNode } from "../utils";
import cakeSceneSlice from "./cakeSceneSlice";

function CakeScene({
  placementObject,
  setPlacementObject,
  selectedObject,
  setSelectedObject,
  cake,
}) {
  const { scene, raycaster } = useThree();

  const placementObjectsRef = useRef([]);
  const cakeMeshRef = useRef(new THREE.Mesh());
  const events = useMouseEvents();
  const drag = useDraggable();
  const longPress = useLongPress(5000);

  const hasCollision = useCallback((object) => {
    return placementObjectsRef.current.reduce((prev, currentObject) => {
      const currentBox = new THREE.Box3().setFromObject(currentObject, true);
      const objectBox = new THREE.Box3().setFromObject(object, true);

      return prev || currentBox.intersectsBox(objectBox);
    }, false);
  }, []);

  const onObjectSelection = events.add(
    "click",
    /**
     *
     * @param {THREE.Intersection<THREE.Object3D>} intersect
     * @returns
     */
    (intersect) => {
      setSelectedObject(intersect.object);
    }
  );

  const addPlacementObject = (object) => {
    placementObjectsRef.current.push(object);
    scene.add(object);
  };

  const removePlacementObject = (object) => {
    scene.remove(object);
    placementObjectsRef.current = placementObjectsRef.current.filter(
      (o) => o.uuid !== object.uuid
    );
  };

  const onSurfaceObjectPlacement = events.add(
    "click",
    /**
     *
     * @param {THREE.Intersection<THREE.Object3D>} intersect
     * @returns
     */
    (intersect) => {
      if (placementObject === null) {
        return () => {};
      }

      let unsubscribe = [];

      const normal = intersect.object
        .localToWorld(intersect.face.normal)
        .normalize();

      const instance = placementObject.clone();

      instance.lookAt(normal);

      instance.position.set(
        intersect.point.x,
        intersect.point.y,
        intersect.point.z
      );

      if (!hasCollision(instance)) {
        addPlacementObject(instance);

        setSelectedObject(instance);

        unsubscribe.push(onObjectSelection(instance));

        const longPressEvent = longPress(instance, (intersect) => {
          removePlacementObject(intersect.object);
        });

        unsubscribe.push(longPressEvent);
      }

      return () => {
        unsubscribe.forEach((s) => s());
      };
    }
  );

  useEffect(() => {
    let unsubscribe = () => {};

    if (selectedObject) {
      unsubscribe = drag(
        selectedObject,
        /**
         *
         * @param {THREE.Intersection<THREE.Object3D>} intersect
         */
        (intersect) => {
          const intersects = raycaster
            .intersectObject(cakeMeshRef.current)
            .map((node) => {
              node.object = getRootNode(scene, node.object);
              return node;
            });

          if (intersects[0]) {
            const normal = intersects[0].object
              .localToWorld(intersects[0].face.normal)
              .normalize();

            intersect.object.lookAt(normal.add(intersects[0].point));
            intersect.object.position.x = intersects[0].point.x;
            intersect.object.position.y = intersects[0].point.y;
            intersect.object.position.z = intersects[0].point.z;
          }
        }
      );
    }
    return unsubscribe;
  }, [drag, raycaster, scene, selectedObject]);

  useLayoutEffect(() => {
    return onSurfaceObjectPlacement(cakeMeshRef.current);
  }, [onSurfaceObjectPlacement]);

  return (
    <CakeMesh
      ref={cakeMeshRef}
      castShadow
      position={[0, 0, 0]}
      rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
      layers={cake.parts}
      svgShapePath={cake.svgShapePath}
    >
      <meshStandardMaterial />
    </CakeMesh>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedObject: (object) =>
      dispatch(cakeSceneSlice.actions.setSelectedObject(object)),
    setPlacementObject: (object) =>
      dispatch(cakeSceneSlice.actions.setPlacementObject(object)),
  };
};

const mapStateToProps = (state) => {
  return {
    cake: state.cake,
    selectedObject: state.scene.selectedObject,
    placementObject: state.scene.placementObject,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CakeScene);
