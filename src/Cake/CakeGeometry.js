import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";
import { useLayoutEffect, useMemo, useRef } from "react";
import { ContourGeometry } from "../geometries/ContourGeometry";
import PartialCutterGeometry from "../geometries/PartialCutterGeometry";
import SVGGeometry from "../geometries/SVGGeometry";
import { useCake } from "./CakeContext";
class Accumulator {
  value = 0;

  set(p) {
    if (p) this.value += (p.base.layers * 2 + 1) * p.base.layerThikness;
    else this.value = 0;
    return this.value;
  }
}

function CakeGeometry({ showInner = false }) {
  const cake = useCake();
  const nextPosition = useMemo(() => new Accumulator(), []);
  const height = useMemo(() => new Accumulator(), []);

  const csg = useRef();
  useLayoutEffect(() => {
    console.log(csg);
  }, []);
  return (
    <Geometry useGroups ref={csg}>
      <Base scale={[2, 2, 1]}>
        <Geometry useGroups>
          {cake.parts.map(({ base, deco }, index) => {
            const scaleOffset = 1 + index * -base.offset;

            const layers = base.layers * 2 + 1;
            const depth = layers * base.layerThikness;
            height.set(cake.parts[index]);
            return (
              <Addition
                key={index}
                position={[0, 0, nextPosition.set(cake.parts[index - 1])]}
              >
                <Geometry useGroups>
                  <Base>
                    <Geometry useGroups>
                      <Base material={base.mat.outer}>
                        <SVGGeometry
                          depth={depth}
                          path="/svgs/8664845_face_grin_tongue_icon.svg"
                        />
                      </Base>

                      {deco && (
                        <>
                          <Addition position={[0, 0, depth]}>
                            <ContourGeometry radius={scaleOffset}>
                              <primitive object={deco.countour} />
                            </ContourGeometry>
                          </Addition>
                          <Addition position={[0, 0, 0.1]}>
                            <ContourGeometry radius={scaleOffset}>
                              <primitive object={deco.countour} />
                            </ContourGeometry>
                          </Addition>
                        </>
                      )}
                    </Geometry>
                  </Base>
                </Geometry>
              </Addition>
            );
          })}
        </Geometry>
      </Base>

      {showInner && (
        <Subtraction>
          <PartialCutterGeometry depth={height.value} radius={2} />
        </Subtraction>
      )}
    </Geometry>
  );
}

export default CakeGeometry;
