import { Addition, Base, Geometry } from "@react-three/csg";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import SVGGeometry from "../../geometries/SVGGeometry";
import { useCake } from "./CakeContext";

class Accumulator {
  value = 0;

  set(p) {
    if (p) this.value += (p.base.layers * 2 + 1) * p.base.layerThikness;
    else this.value = 0;
    return this.value;
  }
}

function CakeGeometry({ partial = false }) {
  const { cake } = useCake();
  const nextPosition = useMemo(() => new Accumulator(), []);
  const height = useMemo(() => new Accumulator(), []);

  const svg = useLoader(SVGLoader, "/assets/svgs/8664845_face_grin_tongue_icon.svg");

  // const totalLayers = useMemo(
  //   () => cake.parts.reduce((a, b) => a + b.base.layers, 0),
  //   [cake.parts]
  // );

  return (
    <Geometry useGroups>
      <Base scale={[2, 2, 1]}>
        <Geometry useGroups>
          {cake.parts.map(({ base, deco }, index) => {
            height.set(cake.parts[index]);

            const scaleOffset = 1 + index * -base.offset;
            const layers = base.layers * 2 + 1;
            const depth = layers * base.layerThikness;
            const nextYPos = nextPosition.set(cake.parts[index - 1]);
            return (
              <Addition
                key={index}
                scale={[scaleOffset, scaleOffset, 1]}
                position={[0, 0, nextYPos]}
                material={base.mat.outer}
              >
                <SVGGeometry depth={depth} svg={svg} />
              </Addition>
            );
          })}
        </Geometry>
      </Base>
    </Geometry>
  );
}

export default CakeGeometry;
