import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { initThree } from "../initThree";
import * as THREE from "three";
import "./index.css";
import moonRight from "../../asset/moon/earth-right.png";
import moonLeft from "../../asset/moon/earth-left.png";
import moonTop from "../../asset/moon/earth-top.png";
import moonBottom from "../../asset/moon/earth-bottom.png";
import moonFront from "../../asset/moon/earth-front.png";
import moonBack from "../../asset/moon/earth-back.png";
import NavBar from "./NavBar";
import NavItemBar from "./NavItemBar";
import UI_DATA from "./UI_DATA.json";
// import { AtomModel } from "./util/model/Atom";
import { HomePlanet } from "./util/model/PlanetHome";
import { onDocumentMouseMove } from "./util/camera/camera";
// TODO: Build Task
// change the favicon
// change the title
// optimize the image
// add a loading screen
// deploy to netlify

// loader
import { loadTexture } from "./util/texture/loadTexture";

// content blocks
import HomeHeader from "./pages/home-headline";

// Animation
import {
  AnimateZMoveHP,
  AnimationRotateY,
} from "./util/animation/home-planet-animation";

export interface IAppProps {}

export default function SpaceShipShowcase(props: IAppProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mouseInteractionAreaRef = useRef<HTMLDivElement>(null);
  const [isInited, setIsInited] = useState(false);
  const [mouseMoveCoordinate, setMouseMoveCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [loadingProgress, setLoadingProgress] = useState<any>({});
  useEffect(() => {
    if (canvasRef.current && !isInited) {
      const canvas = canvasRef.current;
      // Get Data
      const HomePlanetObject = UI_DATA["3D"].find(
        (item) => item.objectName === "HomePlanet"
      );
      const CameraObject = UI_DATA["3D"].find(
        (item) => item.objectName === "Camera"
      );
      const LightingObject = UI_DATA["3D"].find(
        (item) => item.objectName === "Sunlight"
      );
      const LoadingObject = UI_DATA["2D"].Loader;

      const scene = new THREE.Scene();
      (async function () {
        setLoadingProgress(LoadingObject[0]);
        const texture = await loadTexture(
          [moonRight, moonLeft, moonTop, moonBottom, moonFront, moonBack],
          "cube"
        );
        scene.background = texture;
        setLoadingProgress(LoadingObject[1]);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        );
        camera.position.z = CameraObject?.objectPosition.z || 5;
        camera.position.x = CameraObject?.objectPosition.x || 0;
        camera.position.y = CameraObject?.objectPosition.y || 0;
        camera.lookAt(0, 0, 0);
        setLoadingProgress(LoadingObject[2]);

        // import mesh
        const mesh = await HomePlanet();
        // Moon: -117,-25,-8
        // Earth: -30,84,-71
        // Jup: 30,-45,-180
        setLoadingProgress(LoadingObject[3]);
        // camera lookat => subtract 10 from z
        // light directly from the back, also ambient light
        const light = new THREE.DirectionalLight(0xffffff, 15);
        // light.position.set(0, 0, -30);
        light.position.set(
          LightingObject?.objectPosition.x || 0,
          LightingObject?.objectPosition.y || 0,
          LightingObject?.objectPosition.z || 0
        );
        // const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(light);
        setLoadingProgress(LoadingObject[4]);
        // scene.add(ambientLight);
        //   mouse pointer anitmation
        let angle = 0;
        // cone: y => -12 to 12, x => -12 to 12
        const animation = () => {
          mesh.children[0].rotation.y += 0.0004;
          mesh.children[1].rotation.y += 0.001;
        };
        // mesh.position.y = 12;
        setLoadingProgress(LoadingObject[5]);
        const renderInstance = await initThree({
          scene,
          camera,
          canvas,
          width,
          height,
          mesh,
          showPerformance: false,
          RotateControls: false,
          animation,
          axisHelper: false,
        });
        // find by name in array of objects
        mesh.position.x = HomePlanetObject?.objectPosition.x || 0;
        mesh.position.z = HomePlanetObject?.objectPosition.z || 0;
        mesh.position.y = HomePlanetObject?.objectPosition.y || 0;

        // After this, the scene is rendered
        setIsInited(true);
        const { renderer } = renderInstance;

        // TODO: mechanism to mount and unmout mesh
        (window as any).activeMesh = mesh;

        // await for 1s
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            AnimateZMoveHP(mesh, -28);
            AnimationRotateY(mesh, Math.PI * 0.3);
          }, 200);
          resolve();
        });

        window.addEventListener("resize", () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        });

        const calculateMeshRotation = (event: MouseEvent) => {
          if ((window as any).lastMouseX) {
            const diff = (window as any).lastMouseX - event.clientX;
            if (mesh) {
              mesh.rotation.y += diff / 1000;
            }
          }
        };

        document.addEventListener("mousemove", (event) => {
          if (event.buttons === 1) {
            // reject mouse move if mouse is hold down
            return;
          }
          const { x, y } = onDocumentMouseMove(event);
          camera.lookAt(x * 7, y * 7, 0);
          setMouseMoveCoordinate({ x, y });
        });

        mouseInteractionAreaRef.current?.addEventListener(
          "mousemove",
          async (event) => {
            if (event.buttons === 1) {
              (window as any).lastMouseX = event.clientX;
              await new Promise<void>((resolve) => {
                setTimeout(() => {
                  resolve();
                }, 100);
              });
              calculateMeshRotation(event);
            }
          }
        );
      })();
      //  cube map background
    }
  }, [isInited]);

  return (
    <section className="three-section">
      <div
        className={`loader-overlay ${isInited ? "first-load-animation" : ""}`}
      ></div>
      <div className="ui-overlay">
        <NavBar logoOnly />
        <div className="container">
          <div className="row">
            <div
              className="col-md-6 col-12 pe-all cursor-hand"
              ref={mouseInteractionAreaRef}
            >
              <div className="p-3 bg-transparent overlay-column">
                {!isInited && (
                  <div className="loader-container gap-3">
                    <div className="loader arrow me-3">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <p className="loading-progress fs-3 text-light fw-bold mb-0 glow-text-weak textured-text">
                        {loadingProgress?.progress}%
                      </p>
                      <p className="loadingText mb-0 fs-4 text-light textured-text glow-text-weak">
                        {loadingProgress?.step}
                      </p>
                    </div>
                  </div>
                )}
                {isInited && (
                  <div className="bottom-left pe-none">
                    <div className="d-flex text-light flex-column align-items-end justify-content-start gap-2">
                      <h4 className="fw-bold fs-3 mb-0 pb-0 ">
                        Alpha Centari{" "}
                      </h4>
                      <span className="text-light fs-6 pe-all">
                        4.36 light years away
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div
                className="p-3 bg-transparent overlay-column d-flex flex-column align-items-start justify-content-start gap-4 fade-in"
                style={{
                  transform: `perspective(500px) rotateY(-15deg) translate(${
                    mouseMoveCoordinate.x * 30
                  }px, ${mouseMoveCoordinate.y * 30}px)`,
                }}
              >
                <div className="hero-text-container mb-5">
                  <nav className="navbar-nav glass hero-nav">
                    <NavItemBar
                      activeIndex={0}
                      data={UI_DATA["2D"].Navigation}
                    />
                  </nav>
                  <HomeHeader />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="headline-container d-flex align-items-center justify-content-center w-100 h-100">
          <div className="d-flex flex-column align-items-end me-2 text-white">Test</div>
        </div> */}
      </div>
      <div className="canvas position-fixed" ref={canvasRef}></div>
    </section>
  );
}
