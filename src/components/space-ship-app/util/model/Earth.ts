import * as THREE from "three";
import PlanetBase from "../../../../asset/earth/Earth_baseColor.jpeg";
import PlanetMetalic from "../../../../asset/earth/Earth_metallicRoughness.jpeg";
import Normal from "../../../../asset/earth/Earth_normal.jpeg";
import Emissive from "../../../../asset/earth/Earth_emissive.jpeg";

// clouds
import PlanetCloudBase from "../../../../asset/earth/Clouds.jpeg";

// Shader
import { vertexShader } from "../shaders/vertex";
import { fragmentShader } from "../shaders/fragment";
import { loadTexture } from "../texture/loadTexture";
import { emissiveCancel } from "../shaders/emissiveCancel";

// DATA
// import UI_DATA from "../../../space-ship-app/UI_DATA.json";

// Bump map was loaded after the earth mesh
export const Earth = async ({
  Px = 0,
  Py = 0,
  Pz = 0,
}): Promise<THREE.Group> => {
  const group = new THREE.Group();
  const sphere = new THREE.SphereGeometry(25, 64, 64);
  const base = await loadTexture(PlanetBase);
  const roughnessMap = await loadTexture(PlanetMetalic);
  const normalMap = await loadTexture(Normal);
  const emissive = await loadTexture(Emissive);
  base.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: base,
    metalness: 0.1,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1, 1),
    roughnessMap: roughnessMap,
    metalnessMap: roughnessMap,
    emissiveMap: emissive,
    emissiveIntensity: 0.4,
    emissive: new THREE.Color(0xffff88),
  });

//   material.onBeforeCompile = function (shader) {
//     shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', emissiveCancel);
//   };

  const clouds = await loadTexture(PlanetCloudBase);
  let cloudGeo = new THREE.SphereGeometry(25.8, 64, 64);
  let cloudsMat = new THREE.MeshStandardMaterial({
    alphaMap: clouds,
    transparent: true,
  });

  //   Shadow cast by atomosphere, and halo from refracted light
  let atmosGeo = new THREE.SphereGeometry(34, 64, 64);
  let atmosMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader as string,
    fragmentShader: fragmentShader as string,
    uniforms: {
      atmOpacity: { value: 0.55 },
      atmPowFactor: { value: 5.2 },
      atmMultiplier: { value: 7.3 },
    },
    // notice that by default, Three.js uses NormalBlending, where if your opacity of the output color gets lower, the displayed color might get whiter
    blending: THREE.AdditiveBlending, // works better than setting transparent: true, because it avoids a weird dark edge around the earth
    side: THREE.BackSide, // such that it does not overlays on top of the earth; this points the normal in opposite direction in vertex shader
  });
  const atmos = new THREE.Mesh(atmosGeo, atmosMat);
  // atoms rotate 30% faster and clouds mesh
  const cloudsMesh = new THREE.Mesh(cloudGeo, cloudsMat);
  cloudsMesh.castShadow = true;
  const sphereMesh = new THREE.Mesh(sphere, material);
  group.add(sphereMesh);
  group.add(cloudsMesh);
  group.add(atmos);

  // set Mesh Position
  // set Mesh Positions
  group.position.set(Px, Py, Pz);


  return group;
};
