import * as React from "react";
import LargeButton from "../largeButton";
export interface props {}

export default function HomeHeader(props: props) {
  return (
    <>
      <h2 className="text-light text-left mw-20 headline-hero glow-text-weak textured-text mb-5">
        {" "}
        Pioneer Human Expansion
        <span className="headline-hero-highlight glow-text-weak-blue">
        </span>{" "}
        in Space
      </h2>
      <h3 className="hero-sub-title">
        Orbital Construction, Salvage, Interplanetary Transportation
      </h3>
      <div className="d-flex gap-4 align-items-stretch justify-content-stretch mt-5">
        <LargeButton
          text="Investor Relationship"
          icon="ph:chart-line-up-duotone"
        />
        <LargeButton text="Career" icon="ph:briefcase-duotone" />
        <LargeButton text="Our Mission" icon="ph:rocket-launch-duotone" />
      </div>
    </>
  );
}
