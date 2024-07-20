import * as React from "react";
import LargeButton from "../largeButton";
import UI_DATA from "../UI_DATA.json";
export interface props {
  activePlanet: number;
}

export default function SectionContent({ activePlanet }: props) {
  const activePlanetObject = UI_DATA["3D"].find(
    (item) => item.objectNum === activePlanet
  );
  return (
    <>
      <h2 className="text-light text-left mw-20 headline-hero glow-text-weak textured-text mb-5">
        {activePlanetObject?.copies?.tagline}
      </h2>
      <h3 className="hero-sub-title p-text-regular">
        <div className="fw-bold fs-3 font-serif off-white">
          {activePlanetObject?.copies?.subtitle}
        </div>
        <p className="fs-5 mt-3 fw-semibold">
          <div
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line react/no-danger
              __html: activePlanetObject?.copies
                ?.overall_introduction_location as string,
            }}
          ></div>
        </p>
      </h3>
      <div className="d-flex gap-4 align-items-stretch justify-content-stretch mt-5">
        <LargeButton text="Planet News" icon="ph:newspaper-duotone" />
        <LargeButton text="Planet Career" icon="ph:briefcase-duotone" />
        <LargeButton text="Contact Us" icon="ph:phone-duotone" />
      </div>
      <hr />
      <p className="fs-4 mt-3 text-light">
        <div
          dangerouslySetInnerHTML={{
            __html: activePlanetObject?.copies?.stations_detail_description,
          }}
        ></div>
      </p>
    </>
  );
}
