import * as THREE from "three";
export const Earth = async (): Promise<THREE.Group> => {
  const sphere = new THREE.SphereGeometry(25, 32, 32);
  const group = new THREE.Group();
  group.add(
    new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x0000ff }))
  );
  return group;
};
