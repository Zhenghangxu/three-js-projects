import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
export const AnimateZMoveHP = (
  mesh: THREE.Object3D,
  delta: number,
  callback?: () => void
) => {
  const animation = new TWEEN.Tween(mesh.position)
    .to(
      {
        z: mesh.position.z + delta,
      },
      1100
    )
    //.delay (1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    //.onUpdate(() => render())
    .start();
  return animation;
};

export const AnimationRotateY = (
    mesh: THREE.Object3D,
    delta: number,
    callback?: () => void
  ) => {
    const animation = new TWEEN.Tween(mesh.rotation)
      .to(
        {
          y: mesh.rotation.y + delta,
        },
        1100
      )
      //.delay (1000)   
      .easing(TWEEN.Easing.Cubic.InOut)
      //.onUpdate(() => render())
      .start();
    return animation;
  };