import {
  AccumulativeShadows,
  Environment,
  PerformanceMonitor,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Lightformers from "./LightFormers";

export default function Scene({ children }) {
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
        position={[0, -1, 0]}
        frames={100}
        alphaTest={0.9}
        scale={100}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -8]}
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
