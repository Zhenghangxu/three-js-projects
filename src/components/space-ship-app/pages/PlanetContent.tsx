import * as React from "react";
import LargeButton from "../largeButton";
export interface props {
  projects: project[];
}

interface project {
  name: string;
  subTitle?: string;
  description: { __html: string | TrustedHTML };
  image?: string;
  show: boolean;
}

export default function PlanetContent(props: props) {
  return (
    <>
      {props.projects.map((project, index) => (
        <div
          key={index}
          className={`project-block ${!project.show ? "d-none" : ""}`}
        >
          <h2 className="text-light text-left mw-20 headline-hero glow-text-weak textured-text mb-5">
            {project.name}
          </h2>
          {project.image && (
            <img
              src={project.image}
              alt={project.name}
              className="project-image"
            />
          )}
          {project.subTitle && (
            <h3 className="hero-sub-title">{project.subTitle}</h3>
          )}
          <div className="dd-html" dangerouslySetInnerHTML={project.description}></div>
        </div>
      ))}
    </>
  );
}
