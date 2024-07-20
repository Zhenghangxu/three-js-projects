import * as React from "react";
import { useState, useEffect } from "react";
import { InlineIcon } from "@iconify/react";
import NavItemBar from "./NavItemBar";

export interface navItemProps {
  icon: string;
  title: string;
  onClick?: () => void;
}

export interface NavProps {
  data?: navItemProps[];
  activeIndex?: number;
  logoOnly?: boolean;
}

export default function NavBar(props: NavProps) {
  const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);
  useEffect(() => {
    setActiveIndex(props.activeIndex || 0);
    
  }, [props.activeIndex]);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-transparent text-white px-5 position-fixed">
        <div className="container-fluid justify-content-start">
          <div className="d-flex align-items-center justify-content-center">
            <a className="navbar-brand text-white" href="#">
              <h2 className="text-white headline mb-0">Cosmodyn</h2>
            </a>
            {props.logoOnly ? null : (
              <>
                <button
                  className="navbar-toggler text-white"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav glass gap-5">
                    <NavItemBar data={props.data} activeIndex={activeIndex} />
                    {/* <li className="nav-item">
                  <a
                    className="nav-link active text-white"
                    aria-current="page"
                    href="#"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <InlineIcon icon="mdi:earth" fontSize="30px" />
                      <span>Terra</span>
                    </div>
                  </a>
                </li> */}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
