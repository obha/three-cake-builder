import { OrbitControls, Stats } from "@react-three/drei";
import { Suspense } from "react";

import { CakeProvider } from "./components/Cake/CakeContext";
import HtmlLoader from "./components/HtmlLoader";
import Scene from "./components/Scene";
import CakeScene from "./containers/CakeScene";

export function App() {
  return (
    <CakeProvider>
      <Scene>
        <Suspense fallback={<HtmlLoader />}>
          <CakeScene />
          {/* <CameraRig /> */}
          <OrbitControls makeDefault dampingFactor={0.3} />
          <gridHelper />
        </Suspense>
        <Stats />
      </Scene>
    </CakeProvider>
  );
}
