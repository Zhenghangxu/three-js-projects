import * as THREE from "three";
import PlanetBase from "../../../../asset/continental/Planet_continental_baseColor.jpeg";
import PlanetMetalic from "../../../../asset/continental/Planet_continental_metallicRoughness.png";
import PlanetNormal from "../../../../asset/continental/Planet_continental_normal.jpeg";

// clouds
import PlanetCloudBase from "../../../../asset/continental/planet_continental_cloud_baseColor.png";
import PlanetCloudNormal from "../../../../asset/continental/planet_continental_cloud_normal.jpeg";

// Shader
import { vertexShader } from "../shaders/vertex";
import { fragmentShader } from "../shaders/fragment";
import { loadTexture } from "../texture/loadTexture";

// DATA
import UI_DATA from "../../../space-ship-app/UI_DATA.json";

// TODO: use a plane for the earth instead
// TODO: implement an async texture loading function
// Bump map was loaded after the earth mesh
export const HomePlanet = async ({
  Px = 0,
  Py = 0,
  Pz = 0,
}): Promise<THREE.Group> => {
  const group = new THREE.Group();
  const sphere = new THREE.SphereGeometry(25, 64, 64);
  // adjust for earth's oval shape
  //   sphere.scale(1.02, 1, 1);
  const base = await loadTexture(PlanetBase);
  const roughnessMap = await loadTexture(PlanetMetalic);
  const normalMap = await loadTexture(PlanetNormal);
  base.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: base,
    roughness:1,
    roughnessMap: roughnessMap,
    metalnessMap: roughnessMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.6, 0.6),
    // emit blue sky light
  });

  const clouds = await loadTexture(PlanetCloudBase);
  const cloudsNormal = await loadTexture(PlanetCloudNormal);
  let cloudGeo = new THREE.SphereGeometry(25.8, 64, 64);
  let cloudsMat = new THREE.MeshStandardMaterial({
    map: clouds,
    normalMap: cloudsNormal,
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
  group.add(new THREE.Mesh(sphere, material));
  group.add(cloudsMesh);
  group.add(atmos);

  // set Mesh Position
  // set Mesh Positions
  group.position.set(Px, Py, Pz);

  return group;
};
