import * as THREE from "three";

export default function cakeInsideTexture({
  layerThikness = 0.05,
  width = 512,
  height = 512,
  defaultFill = "#FFF",
}) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.fillStyle = defaultFill;

  ctx.fill();
  for (let i = 0; i < 100; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = "#FFBF78";
    } else {
      ctx.fillStyle = defaultFill;
    }

    ctx.beginPath();
    ctx.rect(
      0,
      ctx.canvas.height * layerThikness * i,
      ctx.canvas.width,
      ctx.canvas.height * layerThikness
    );
    ctx.fill();
    ctx.closePath();
  }

  const texture = new THREE.CanvasTexture(ctx.canvas);

  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}
