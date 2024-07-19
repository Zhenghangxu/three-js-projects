import * as THREE from "three";
export function convertMouseCoordinate(event: MouseEvent) {
  let x = (event.clientX / window.innerWidth) * 2 - 1;
  let y = (event.clientY / window.innerHeight) * 2 - 1;
  return { x, y };
}

export const getMouseHoverMesh = (
  event: MouseEvent,
  camera: THREE.Camera,
  scene: THREE.Scene
) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const { x, y } = convertMouseCoordinate(event);
  // Flip the coordinate since in NDC, y value increase as you go up
  mouse.set(x, -1 * y);
  // Ignore Invisible objects
  // only return intersected objects in layer 4
  raycaster.layers.enable(4);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  return intersects;
};
