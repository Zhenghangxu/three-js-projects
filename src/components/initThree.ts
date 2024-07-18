import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {ArcballControls} from "three/examples/jsm/controls/ArcballControls.js";
import TWEEN from "@tweenjs/tween.js";
import { GUI } from "dat.gui";

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

  // GUI
  const gui = new GUI();
  const cubeFolder = gui.addFolder("Mesh");
  cubeFolder.add(mesh[0].rotation, "x", 0, Math.PI * 2);
  cubeFolder.add(mesh[0].rotation, "y", 0, Math.PI * 2);
  cubeFolder.add(mesh[0].rotation, "z", 0, Math.PI * 2);
  cubeFolder.open();
  const cameraFolder = gui.addFolder("Camera Pos");
  cameraFolder.add(camera.position, "z", 0, 20);
  cameraFolder.add(camera.position, "x", 0, 20);
  cameraFolder.add(camera.position, "y", 0, 20);
  cameraFolder.open();
  const cameraLookAt = { x: 0, y: 0, z: 0 };

  const cameraLKFolder = gui.addFolder("Camera Look At");
  cameraLKFolder.add(cameraLookAt, "x", -20, 20).onChange(updateCamera);
  cameraLKFolder.add(cameraLookAt, "y", -20, 20).onChange(updateCamera);
  cameraLKFolder.add(cameraLookAt, "z", -20, 20).onChange(updateCamera);
  cameraLKFolder.open();

  function updateCamera() {
    camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
  }
  animate();
  return { renderer, scene, camera, controls, stats, gui, mesh };
  // TODO: figure out why animation loop is requireed here
};
