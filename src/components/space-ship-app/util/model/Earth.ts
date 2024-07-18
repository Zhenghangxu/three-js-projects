import * as THREE from "three";
import { loadTexture } from "../texture/loadTexture";
export const Earth = async ({
    Px = 0,
    Py = 0,
    Pz = 0,
}): Promise<THREE.Group> => {
  const sphere = new THREE.SphereGeometry(25, 32, 32);
  const group = new THREE.Group();
  group.add(
    new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0000ff }))
  );
  group.position.set(Px, Py, Pz);
  return group;
};
