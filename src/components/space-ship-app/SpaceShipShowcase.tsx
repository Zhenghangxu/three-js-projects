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

// loader
import { loadTexture } from "./util/texture/loadTexture";

// content blocks
import HomeHeader from "./pages/home-headline";

export interface IAppProps {}

export default function SpaceShipShowcase(props: IAppProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isInited, setIsInited] = useState(false);
  const [enableMouseParallax, setEnableMouseParallax] = useState(true);
  const [mouseMoveCoordinate, setMouseMoveCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [mouseStartX, setMouseStartX] = useState<Number | null>(null);
  useEffect(() => {
    if (canvasRef.current && !isInited) {
      console.log("canvasRef.current", canvasRef.current);
      const canvas = canvasRef.current;
      // Get Data
      const HomePlanetObject = UI_DATA["3D"].find(
        (item) => item.objectName === "HomePlanet"
      );
      const CameraObject = UI_DATA["3D"].find(
        (item) => item.objectName === "Camera"
      );
      const scene = new THREE.Scene();
      (async function () {
        const texture = await loadTexture(
          [moonRight, moonLeft, moonTop, moonBottom, moonFront, moonBack],
          "cube"
        );
        scene.background = texture;
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

        // import mesh
        const mesh = await HomePlanet();
        // Atom Light, sun yellow
        // const atomLight = new THREE.PointLight(0xffffff, 500, 1000, 0);
        // atomLight.position.set(0, 0, -1000);
        // Moon: -117,-25,-8
        // Earth: -30,84,-71
        // Jup: 30,-45,-180

        // camera lookat => subtract 10 from z
        // light directly from the back, also ambient light
        const light = new THREE.DirectionalLight(0xffffff, 15);
        // light.position.set(0, 0, -30);
        light.position.set(-30, 5, 30);
        // const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(light);
        // scene.add(ambientLight);
        //   mouse pointer anitmation
        let angle = 0;
        // cone: y => -12 to 12, x => -12 to 12
        const animation = () => {
          mesh.children[0].rotation.y += 0.0004;
          mesh.children[1].rotation.y += 0.001;
        };
        // find by name in array of objects
        mesh.position.x = HomePlanetObject?.objectPosition.x || 0;
        mesh.position.z = HomePlanetObject?.objectPosition.z || 0;
        mesh.position.y = HomePlanetObject?.objectPosition.y || 0;
        // mesh.position.y = 12;
        const renderInstance = initThree({
          scene,
          camera,
          canvas,
          width,
          height,
          mesh,
          showPerformance: true,
          RotateControls: false,
          animation,
          axisHelper: true,
        });
        // After this, the scene is rendered
        setIsInited(true);
        const { renderer, controls } = renderInstance;
        window.addEventListener("resize", () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        });
        controls?.target.set(
          HomePlanetObject?.objectPosition.x as number,
          HomePlanetObject?.objectPosition.y as number,
          HomePlanetObject?.objectPosition.z as number
        );
        document.addEventListener("mousemove", (event) => {
          if (enableMouseParallax === false || event.buttons === 1) {
            return;
          }
          // reject mouse move if mouse is hold down
          const { x, y } = onDocumentMouseMove(event);
          camera.lookAt(x * 3, y * 3, 0);
          setMouseMoveCoordinate({ x, y });
        });

        // document.addEventListener("mousedown", (event) => {
        //   setEnableMouseParallax(false);
        //   // get mouse coordinate
        //   setMouseStartX(event.clientX);
        // });

        // document.addEventListener("mouseup", (event) => {
        //   setMouseStartX(null);
        // });
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
            <div className="col-md-6 col-12">
              <div className="p-3 bg-transparent overlay-column">
                <div className="bottom-left">
                  <div className="d-flex text-light flex-column align-items-end justify-content-start gap-2">
                    <h4 className="fw-bold fs-3 mb-0 pb-0 ">Alpha Centari </h4>
                    <span className="text-light fs-6 pe-all">
                      4.36 light years away
                    </span>
                  </div>
                </div>
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
