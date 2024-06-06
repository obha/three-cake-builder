import {
  AccumulativeShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  OrbitControls,
  PerformanceMonitor,
  RandomizedLight,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, Depth, LayerMaterial } from "lamina";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { CakeProvider, DEFAULT_CAKE } from "./Cake/CakeContext";
import CakeGeometry from "./Cake/CakeGeometry";

function Scene({ children }) {
  const [degraded, degrade] = useState(false);
  return (
    <Canvas shadows camera={{ position: [5, 10, 15], fov: 30 }}>
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        castShadow
        intensity={2}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.5} />

      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
      {/** PerfMon will detect performance issues */}
      <PerformanceMonitor onDecline={() => degrade(true)} />
      {/* Renders contents "live" into a HDRI environment (scene.environment). */}
      <Environment
        frames={degraded ? 1 : Infinity}
        resolution={256}
        background
        blur={1}
      >
        <Lightformers />
      </Environment>
      {children}
    </Canvas>
  );
}

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const group = useRef();
  useFrame(
    (state, delta) =>
      (group.current.position.z += delta * 10) > 20 &&
      (group.current.position.z = -60)
  );
  return (
    <>
      {/* Ceiling */}
      <Lightformer
        intensity={0.75}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[3, 1, 1]}
            />
          ))}
        </group>
      </group>
      {/* Sides */}
      <Lightformer
        intensity={4}
        rotation-y={Math.PI / 2}
        position={[-5, 1, -1]}
        scale={[20, 0.1, 1]}
      />
      <Lightformer
        rotation-y={Math.PI / 2}
        position={[-5, -1, -1]}
        scale={[20, 0.5, 1]}
      />
      <Lightformer
        rotation-y={-Math.PI / 2}
        position={[10, 1, 0]}
        scale={[20, 1, 1]}
      />
      {/* Accent (red) */}
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer
          form="ring"
          color="red"
          intensity={1}
          scale={10}
          position={[-15, 4, -18]}
          target={[0, 0, 0]}
        />
      </Float>
      {/* Background */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={THREE.BackSide}>
          <Color color="#444" alpha={1} mode="normal" />
          <Depth
            colorA="blue"
            colorB="black"
            alpha={0.5}
            mode="normal"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
        </LayerMaterial>
      </mesh>
    </>
  );
}

function CameraRig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.lerp(
      v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
}

function CakeScene() {
  const { raycaster, scene } = useThree();

  /**
   *
   * @param {import("@react-three/fiber").ThreeEvent<MouseEvent>} event
   */
  const addObject = ({ object }) => {
    // const geo = new THREE.SphereGeometry(0.1);
    // const mat = new THREE.MeshBasicMaterial();
    // const mesh = new THREE.Mesh(geo, mat);
    const { point } = raycaster.intersectObject(object)[0];
  };

  return (
    <CakeProvider value={DEFAULT_CAKE}>
      <mesh
        castShadow
        position={[0, 0, 0]}
        onClick={addObject}
        rotation={[THREE.MathUtils.degToRad(-90), 0, 0]}
      >
        <CakeGeometry showInner/>
      </mesh>
    </CakeProvider>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export function App() {
  return (
    <Scene>
      <Suspense fallback={<Loader />}>
        <CakeScene />
        {/* <CameraRig /> */}
        <OrbitControls makeDefault dampingFactor={0.3} />
        <gridHelper />
      </Suspense>
    </Scene>
  );
}
