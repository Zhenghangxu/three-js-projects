import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { initThree } from "../initThree";
import * as THREE from "three";
import "./index.css";
import skyboxRight from "../../asset/skybox/skybox-right.png";
import skyboxLeft from "../../asset/skybox/skybox-left.png";
import skyboxTop from "../../asset/skybox/skybox-top.png";
import skyboxBottom from "../../asset/skybox/skybox-bottom.png";
import skyboxFront from "../../asset/skybox/skybox-front.png";
import skyboxBack from "../../asset/skybox/skybox-back.png";
import NavBar from "./NavBar";
import NavItemBar from "./NavItemBar";
import UI_DATA from "./UI_DATA.json";
// import { AtomModel } from "./util/model/Atom";
import { HomePlanet } from "./util/model/PlanetHome";
import { Moon } from "./util/model/Moon";
import { Earth } from "./util/model/Earth";
import { JupiterPlanet } from "./util/model/Jupiter";
import { convertMouseCoordinate } from "./util/camera/camera";
import { Tween } from "@tweenjs/tween.js";
import Loader from "../../asset/UI/loader_custom.svg";

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
import SectionContent from "./pages/section-content";

// Animation
import { AnimateMesh } from "./util/animation/home-planet-animation";

export interface IAppProps {}

export default function SpaceShipShowcase(props: IAppProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mouseInteractionAreaRef = useRef<HTMLDivElement>(null);
  const [isInited, setIsInited] = useState(false);
  const [mouseMoveCoordinate, setMouseMoveCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [loadingProgress, setLoadingProgress] = useState<any>({});
  const [activeMesh, setActiveMesh] = useState<number>(0);
  const [renderInstance, setRenderInstance] = useState<any>(null);
  const [hideNav, setHideNav] = useState(false);

  const unmountDelay = 300;

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchPlanetContent = (type: string, activeNum: number) => {
    const data: any = UI_DATA["3D"].find(
      (item) => item.objectNum === activeNum
    );
    if (type === "subtitle") {
      if (data?.copies?.subtitle) {
        return data?.copies?.subtitle;
      } else {
        return null;
      }
    } else {
      //
      const result = data?.copies;
      return result[type];
    }
  };

  const calculateMeshRotation = (event: MouseEvent) => {
    if ((window as any).lastMouseX) {
      const diff = (window as any).lastMouseX - event.clientX;
      return diff / 1000;
    }
  };
  const NAV_DATA: any = [
    {
      icon: "solar:star-circle-bold",
      title: "Home",
      onClick: () => {
        setActiveMesh(0);
      },
    },
    {
      icon: "mdi:earth",
      title: "Terra",
      onClick: () => {
        setActiveMesh(1);
      },
    },
    {
      icon: "hugeicons:moon",
      title: "Luna",
      onClick: () => {
        setActiveMesh(2);
      },
    },
    {
      icon: "hugeicons:jupiter",
      title: "Jupiter",
      onClick: () => {
        setActiveMesh(3);
      },
    },
  ];

  // calculate adjusted position
  const getAdjustedPosition = (object: any) => {
    const screenCoordinateMultiplier = 1 / 1000;

    const adjustedX =
      (object?.objectPosition?.x as number) *
      window.innerWidth *
      screenCoordinateMultiplier;
    const adjustedY =
      (object?.objectPosition?.y as number) *
      window.innerHeight *
      screenCoordinateMultiplier;
    return {
      Px: adjustedX,
      Py: adjustedY,
      Pz: object?.objectPosition.z,
    };
  };

  // Get Data
  const HomePlanetObject = UI_DATA["3D"].find(
    (item) => item.objectName === "HomePlanet"
  );
  const MoonPlanetObject = UI_DATA["3D"].find(
    (item) => item.objectName === "Moon"
  );
  const EarthPlanetObject = UI_DATA["3D"].find(
    (item) => item.objectName === "Earth"
  );
  const JupiterPlanetObject = UI_DATA["3D"].find(
    (item) => item.objectName === "Jupiter"
  );
  const CameraObject = UI_DATA["3D"].find(
    (item) => item.objectName === "Camera"
  );
  const LightingObject = UI_DATA["3D"].find(
    (item) => item.objectName === "Sunlight"
  );

  const LoadingObject = UI_DATA["2D"].Loader;

  useEffect(() => {
    if (canvasRef.current && !isInited) {
      // prevent scroll restoration
      // eslint-disable-next-line
      if ("scrollRestoration" in history) {
        // eslint-disable-next-line
        history.scrollRestoration = "manual";
      }
      const canvas = canvasRef.current;
      const content = contentRef.current;

      document.addEventListener("scroll", () => {
        // get scorll position
        const scrollPosition = document.documentElement.scrollTop;
        if (scrollPosition >= 100) {
          setHideNav(true);
        }
        if (scrollPosition < 20) {
          setHideNav(false);
        }
      });

      const scene = new THREE.Scene();
      (async function () {
        setLoadingProgress(LoadingObject[0]);
        const texture = await loadTexture(
          [
            skyboxRight,
            skyboxLeft,
            skyboxTop,
            skyboxBottom,
            skyboxFront,
            skyboxBack,
          ],
          "cube"
        );
        scene.background = texture;
        setLoadingProgress(LoadingObject[1]);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.1,
          500
        );
        camera.position.z = CameraObject?.objectPosition.z || 5;
        camera.position.x = CameraObject?.objectPosition.x || 0;
        camera.position.y = CameraObject?.objectPosition.y || 0;
        camera.lookAt(4, 5, 0);
        setLoadingProgress(LoadingObject[2]);
        // mesh position
        // set Mesh Positions

        // import mesh
        const HomePlanetMesh = await HomePlanet(
          getAdjustedPosition(HomePlanetObject)
        );

        setLoadingProgress(LoadingObject[3]);

        const moonMesh = await Moon(getAdjustedPosition(MoonPlanetObject));

        setLoadingProgress(LoadingObject[4]);

        const earthMesh = await Earth(getAdjustedPosition(EarthPlanetObject));

        const jupiterMesh = await JupiterPlanet(
          getAdjustedPosition(JupiterPlanetObject)
        );

        // // Hide all Mesh
        // HomePlanetMesh.visible = true;
        // moonMesh.visible = true;
        // earthMesh.visible = true;

        const meshList = [HomePlanetMesh, earthMesh, moonMesh, jupiterMesh];

        meshList.forEach((mesh) => {
          mesh.visible = false;
        });

        // camera lookat => subtract 10 from z
        // light directly from the back, also ambient light
        const light = new THREE.DirectionalLight(
          0xffffff,
          LightingObject?.objectIntensity || 0
        );
        // light.position.set(0, 0, -30);
        light.position.set(
          LightingObject?.objectPosition.x || 0,
          LightingObject?.objectPosition.y || 0,
          LightingObject?.objectPosition.z || 0
        );
        // const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(light);
        // scene.add(ambientLight);
        //   mouse pointer anitmation
        // cone: y => -12 to 12, x => -12 to 12
        // TODO: move this animation to another useEffect hook
        // mesh.position.y = 12;
        setLoadingProgress(LoadingObject[5]);
        const renderInstance = await initThree({
          scene,
          camera,
          canvas,
          width,
          height,
          mesh: meshList,
          showPerformance: false,
          RotateControls: false,
          axisHelper: false,
        });
        setLoadingProgress(LoadingObject[6]);
        // await for 1s

        window.addEventListener("resize", () => {
          // const width = window.innerWidth;
          // const height = window.innerHeight;
          // renderer.setSize(width, height);
          // camera.aspect = width / height;
          camera.updateProjectionMatrix();
        });

        document.addEventListener("mousemove", (event) => {
          if (event.buttons === 1) {
            // reject mouse move if mouse is hold down
            return;
          }
          const { x, y } = convertMouseCoordinate(event);
          camera.lookAt(x * -3, y * -3, 0);
          setMouseMoveCoordinate({ x, y });
        });

        document.addEventListener("mousedown", (event) => {
          // change cursor
          mouseInteractionAreaRef.current?.classList.add("cursor-none");
        });

        document.addEventListener("mouseup", (event) => {
          // change cursor
          mouseInteractionAreaRef.current?.classList.remove("cursor-none");
        });
        setRenderInstance(renderInstance);
        setLoadingProgress(LoadingObject[7]);
        if (meshList[activeMesh as number]) {
          meshList[activeMesh as number].visible = true;
        } else {
          console.error(
            "Active Mesh not found, check if the model is loaded for this button"
          );
        }
        setIsInited(true);
      })();
    }
  }, [isInited]);

  useEffect(() => {
    // Prevent the hook from running on page load
    if (!isInited) {
      return;
    }

    const mouseAreaRef = mouseInteractionAreaRef.current;
    const currentMesh = renderInstance.mesh[activeMesh as number];
    const position_start = getAdjustedPosition(HomePlanetObject);
    currentMesh.position.set(
      position_start.Px,
      position_start.Py,
      position_start.Pz
    );

    (async function () {
      await sleep(unmountDelay * 1.01);
      currentMesh.visible = true;
    })();

    const mouseDragEventHandler = async (event: MouseEvent) => {
      if (event.buttons === 1) {
        (window as any).lastMouseX = event.clientX;
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
        const diff = calculateMeshRotation(event);
        if (diff) {
          currentMesh.rotation.y += diff;
        }
      }
    };

    let animationFrame: number;

    function loopRotateAnimation() {
      if (currentMesh.children[1]) {
        currentMesh.children[0].rotation.y += 0.0004;
        currentMesh.children[1].rotation.y += 0.001;
      } else {
        currentMesh.rotation.y += 0.002;
      }
      animationFrame = requestAnimationFrame(loopRotateAnimation);
    }

    mouseAreaRef?.addEventListener("mousemove", mouseDragEventHandler);

    let animations: Tween<THREE.Euler | THREE.Vector3>[] = [];
    // Animation
    (async function () {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const firstMove = AnimateMesh(currentMesh, "position", -28, 0, "z");
          const secondMove = AnimateMesh(
            currentMesh,
            "rotation",
            Math.PI * 0.3,
            0,
            "y",
            loopRotateAnimation
          );
          animations.push(firstMove, secondMove);
        }, 200);
        resolve();
      });
    })();

    return () => {
      AnimateMesh(currentMesh, "position", unmountDelay, 0, "x", () => {
        currentMesh.visible = false;
        mouseAreaRef?.removeEventListener("mousemove", mouseDragEventHandler);
        (window as any).lastMouseX = null;
        // remove animation
        animations.forEach((animation) => {
          animation.stop();
        });
        cancelAnimationFrame(animationFrame);
      });
    };
  }, [activeMesh, isInited]);

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
              className={`col-md-6 col-12 pe-all ${
                isInited ? "cursor-hand" : ""
              }`}
              ref={mouseInteractionAreaRef}
            >
              <div className="p-3 bg-transparent overlay-column">
                {!isInited && (
                  <div className="loader-container gap-3">
                    <div className="d-flex flex-column align-items-start p-relative">
                      <Loader />
                      <div className="loader-indicator-text d-flex flex-column gap-2 align-items-center justify-content-center">
                        <p className="loading-progress fs-3 text-light fw-bold mb-0 glow-text-weak textured-text">
                          {loadingProgress?.progress}%
                        </p>
                        <span className="loadingText mb-0 fs-4 text-light textured-text glow-text-weak fw-bold">
                          {loadingProgress?.step}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {isInited && (
                  <div className="bottom-left pe-none">
                    <div className="d-flex text-light flex-column align-items-end justify-content-start gap-2">
                      <h4 className="fw-bold fs-3 mb-0 pb-0 ">
                        <div
                          className="dd-html"
                          dangerouslySetInnerHTML={{
                            __html: fetchPlanetContent("years", activeMesh),
                          }}
                        ></div>
                      </h4>
                      <div
                        className="dd-html"
                        dangerouslySetInnerHTML={{
                          __html: fetchPlanetContent(
                            "call_to_action",
                            activeMesh
                          ),
                        }}
                      ></div>
                      {/* <a
                        href="#"
                        className="link-styled text-light fs-6 pe-all"
                      >
                        Our 100 Year Vision
                      </a> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div
                className="p-3 bg-transparent overlay-column d-flex flex-column align-items-start justify-content-start gap-4 fade-in"
                ref={contentRef}
                style={{
                  transform: `perspective(500px) rotateY(-15deg) translate(${
                    mouseMoveCoordinate.x * -30
                  }px, ${mouseMoveCoordinate.y * -30}px)`,
                }}
              >
                <div className="hero-text-container mb-5">
                  {!hideNav && (
                    <nav className="navbar-nav glass hero-nav">
                      <NavItemBar activeIndex={activeMesh} data={NAV_DATA} />
                    </nav>
                  )}
                  {activeMesh === 0 ? (
                    <HomeHeader />
                  ) : (
                    <SectionContent activePlanet={activeMesh} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="canvas position-fixed" ref={canvasRef}></div>
    </section>
  );
}

// Request issue with personal-info
// Mandatory fields are not being validated for maiden name
