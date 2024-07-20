import * as React from "react";
import LargeButton from "../largeButton";
import UI_DATA from "../UI_DATA.json";
export interface props {}

export default function HomeHeader(props: props) {
  const HomePlanetObject = UI_DATA["3D"].find(
    (item) => item.objectName === "HomePlanet"
  );
  return (
    <>
      <h2 className="text-light text-left mw-20 headline-hero glow-text-weak textured-text mb-5">
        Pioneer Human Expansion in Space
      </h2>
      <h3 className="hero-sub-title p-text-regular">
        <div className="fw-bold fs-4">
          {HomePlanetObject?.copies?.home_page_headline}
        </div>
        <p className="fs-6 mt-3">
          <div
            className="dd-html"
            dangerouslySetInnerHTML={{
              __html: HomePlanetObject?.copies?.home_page_intro,
            }}
          ></div>
        </p>
      </h3>
      <div className="d-flex gap-4 align-items-stretch justify-content-stretch mt-5">
        <LargeButton
          text="Investor Relationship"
          icon="ph:chart-line-up-duotone"
        />
        <LargeButton text="Career" icon="ph:briefcase-duotone" />
        <LargeButton text="Our Mission" icon="ph:rocket-launch-duotone" />
      </div>
      <hr />
      <p className="fs-4 mt-3 text-light">
        <div
          className="dd-html"
          dangerouslySetInnerHTML={{
            __html: HomePlanetObject?.copies?.home_page_outtro,
          }}
        ></div>
      </p>
    </>
  );
}
