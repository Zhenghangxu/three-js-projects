import * as THREE from "three";
/**
 * Converts the local coordinates of a mesh object to world coordinates.
 * @param object - The THREE.Mesh object.
 * @param index - The index of the vertex to convert.
 * @returns The world coordinates of the specified vertex.
 */
export const getWorldCoordinate = (object: THREE.Mesh) => {
  const vertex = new THREE.Vector3(); // create once and reuse

  return object.localToWorld(vertex);
};
