import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { connect } from "react-redux";
import cakeSceneSlice from "../containers/cakeSceneSlice";

function ObjectLoader({ path, children, setPlacementObject }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.scale.set(0.5, 0.5, 0.5);
    setPlacementObject(scene);
  }, [scene, setPlacementObject]);

  return children;
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPlacementObject: (object) =>
      dispatch(cakeSceneSlice.actions.setPlacementObject(object)),
  };
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectLoader);
