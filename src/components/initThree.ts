import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls.js";
import TWEEN from "@tweenjs/tween.js";

export const initThree = async ({
  camera,
  scene,
  canvas,
  width,
  height,
  mesh,
  showPerformance = false,
  RotateControls = false,
  animation,
  axisHelper = false,
}: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: any;
  width: number;
  height: number;
  mesh: THREE.Object3D[];
  axisHelper?: boolean;
  showPerformance?: boolean;
  RotateControls?: boolean;
  animation?: () => void;
}) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  mesh.forEach((mesh) => scene.add(mesh));
  if (axisHelper) {
    scene.add(new THREE.AxesHelper(15));
  }
  renderer.render(scene, camera);
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  canvas.appendChild(renderer.domElement);
  let controls: ArcballControls | null = null;
  if (RotateControls) {
    controls = new ArcballControls(camera, renderer.domElement, scene);
    // controls.addEventListener("change", function () {
    //   renderer.render(scene, camera);
    // });
  }
  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    if (animation) {
      animation();
    }
    // log camera and mesh position stats
    // camera Lookat, camera position, mesh position
    stats.update();
    if (RotateControls && controls) {
      controls.update();
    }
    renderer.render(scene, camera);
  }
  if (showPerformance) {
    canvas.appendChild(stats.dom);
  }

  animate();
  return { renderer, scene, camera, controls, stats, mesh };
  // TODO: figure out why animation loop is requireed here
};
