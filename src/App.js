import { Stats } from "@react-three/drei";
import { Suspense } from "react";

import HtmlLoader from "./common/components/HtmlLoader";
import Scene from "./common/components/Scene";
import CakeScene from "./features/scene";

export function App() {
  return (
    <Scene>
      <Stats />
      <Suspense fallback={<HtmlLoader />}>
        <CakeScene />
      </Suspense>
    </Scene>
  );
}
