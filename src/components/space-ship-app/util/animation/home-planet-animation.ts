import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

// Create a common function for all these below

export const AnimateMesh = (
  mesh: THREE.Object3D,
  type: "rotation" | "position",
  delta: number,
  delay: number = 0,
  axis: "x" | "y" | "z",
  callback?: () => void,
  isInfinite: boolean = false
) => {
  const animation = new TWEEN.Tween(mesh[type])
    .to(
      {
        [axis]: mesh[type][axis] + delta,
      }
      // 1100
    )
    .delay(delay)
    .easing(TWEEN.Easing.Cubic.InOut)
    .repeat(isInfinite ? Infinity : 0)
    .onComplete(() => {
      if (callback) {
        callback();
      }
    })
    .start();
  return animation;
};

export const AnimateMeshToPosition = (
  mesh: THREE.Object3D,
  delay: number = 0,
  axis: {
    Px: number;
    Py: number;
    Pz: number;
  },
  callback?: () => void
) => {
  const animation = new TWEEN.Tween(mesh.position)
    .to(
      {
        x: axis.Px,
        y: axis.Py,
        z: axis.Pz,
      }
    )
    .delay(delay)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(() => {
      if (callback) {
        callback();
      }
    })
    .start();
  return animation;
};
