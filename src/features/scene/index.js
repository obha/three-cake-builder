import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";
import * as THREE from "three";

import { CustomDragControls } from "../../common/controls/CustomDragControls";
import useMouseEvents from "../../common/hooks/useMouseEvents";
import { getRootNode } from "../../common/utils";
import CakeMesh from "../cake/mesh";
import slice from "./slice";

function CakeScene({
  placementObject,
  setPlacementObject,
  selectedObject,
  setSelectedObject,
  layers,
  svgShape,
}) {
  const { scene, camera, gl, controls } = useThree();

  const placementObjectsRef = useRef([]);
  const lastSelectedObjectRef = useRef(null);
  const cakeMeshRef = useRef(new THREE.Mesh());
  const events = useMouseEvents();
  const dragConrolsRef = useRef(null);

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


  const addPlacementObject = useCallback(
    (object) => {
      scene.add(object);
      placementObjectsRef.current.push(object);

      const dragConrols = new CustomDragControls(
        placementObjectsRef.current,
        camera,
        gl.domElement
      );

      dragConrols.move = function (selected) {
        const r = dragConrols.getRaycaster();
        const intersects = r
          .intersectObject(cakeMeshRef.current)
          .map((node) => {
            node.object = getRootNode(scene, node.object);
            return node;
          });

        const target = getRootNode(scene, selected);

        if (intersects[0]) {
          const normal = intersects[0].object
            .localToWorld(intersects[0].face.normal)
            .normalize();

          target.lookAt(normal.add(intersects[0].point));
          target.position.x = intersects[0].point.x;
          target.position.y = intersects[0].point.y;
          target.position.z = intersects[0].point.z;
        }
      };

      dragConrols.addEventListener("dragstart", function (event) {
        // event.object.material.emissive.set(0xaaaaaa);
        controls.enabled = false;
      });

      dragConrols.addEventListener("dragend", function (event) {
        // event.object.material.emissive.set(0x000000);

        controls.enabled = true;
      });

      dragConrolsRef.current = dragConrols;
    },
    [camera, controls, gl.domElement, scene]
  );

  const removeSelectedObject = useCallback(() => {
    scene.remove(lastSelectedObjectRef.current);
    placementObjectsRef.current = placementObjectsRef.current.filter(
      (o) => o.uuid !== lastSelectedObjectRef.current.uuid
    );
  }, [scene]);

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

        // const longPressEvent = longPress(instance, (intersect) => {
        //   removePlacementObject(intersect.object);
        // });

        // unsubscribe.push(longPressEvent);
      }

      return () => {
        unsubscribe.forEach((s) => s());
      };
    }
  );

  useEffect(() => {
    if (selectedObject === null) {
      removeSelectedObject();
    } else {
      lastSelectedObjectRef.current = selectedObject;
    }
  }, [removeSelectedObject, selectedObject]);

  useLayoutEffect(() => {
    return onSurfaceObjectPlacement(cakeMeshRef.current);
  }, [onSurfaceObjectPlacement]);

  return (
    <CakeMesh
      castShadow
      ref={cakeMeshRef}
      scale={[2, 2, 2]}
      position={[0, 0, 0]}
      rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
      layers={layers}
      svg={svgShape}
    >
      <OrbitControls
        makeDefault
        dampingFactor={0.3}
        target={cakeMeshRef.current.position}
      />
    </CakeMesh>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedObject: (object) =>
      dispatch(slice.actions.setSelectedObject(object)),
    setPlacementObject: (object) =>
      dispatch(slice.actions.setPlacementObject(object)),
  };
};

const mapStateToProps = (state) => state.scene;

export default connect(mapStateToProps, mapDispatchToProps)(CakeScene);
