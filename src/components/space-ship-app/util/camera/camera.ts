import { PerspectiveCamera } from "three";
export const goTo = ({
  x = 0,
  y = 0,
  z = 0,
  camera = new PerspectiveCamera(0, 0, 0),
}) => {
  // camera look at xyz
  // camera move to place where z = 13
  if (camera) {
    camera.lookAt(x, y, z);
    camera.position.set(x, y, 13);
  }
};

export function onDocumentMouseMove(event: MouseEvent) {
  // get the x,y percentage
  // ie how close to the edge of the screen is the mouse
  // the closer to the edge larger the percentage
  let x = event.clientX / window.innerWidth;
  let y = event.clientY / window.innerHeight;
  if (x > 0.7) {
    x = 0.7;
  }
  if (y > 0.7) {
    y = 0.7;
  }
  if (x < -0.7) {
    x = -0.7;
  }
  if (y < -0.7) {
    y = -0.7;
  }
  // console.log("x:", x, "y:", y);
  return { x, y };
}
