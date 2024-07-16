import * as THREE from "three";
import EarthTexture from "../../../../asset/Albedo.jpg";
import EarthCloudTexture from "../../../../asset/8k_earth_clouds.jpg";
// TODO: use a plane for the earth instead
// TODO: implement an async texture loading function
// Bump map was loaded after the earth mesh
import EarthTextureNormalMap from "../../../../asset/8k_earth_normal_map.png";
import EarthTextureSpecularMap from "../../../../asset/8k_earth_specular_map.png";
import BumpMap from "../../../../asset/Bump.jpg";
import { loadTexture } from "../texture/loadTexture";
export const ShipModel = async (texture: THREE.CubeTexture) => {
  const sphere = new THREE.SphereGeometry(25, 64, 64);

  const earth_texture = await loadTexture(EarthTexture);
  earth_texture.colorSpace = THREE.SRGBColorSpace;
  const normalMap = await loadTexture(EarthTextureNormalMap);
  const specularMap = await loadTexture(EarthTextureSpecularMap);
  const material = new THREE.MeshStandardMaterial({
    map: earth_texture,
    normalMap: normalMap,
    // normalMapType: THREE.TangentSpaceNormalMap,
    roughnessMap: specularMap,
    metalnessMap: specularMap,
    // roughness: 0.8,
    metalness: 0.1,
    // emit blue sky light
    // emissive: new THREE.Color("#0000ff"),
    // emissiveIntensity: 0.1,
  });
  console.log("material created", material);
  return new THREE.Mesh(sphere, material);
};
