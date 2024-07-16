import * as React from "react";
import { useState, useEffect } from "react";
import { InlineIcon } from "@iconify/react";

export interface navItemProps {
  icon: string;
  title: string;
  onClick?: () => void;
}

export interface NavProps {
  data?: navItemProps[];
  activeIndex?: number;
}

export default function NavItemBar(props: NavProps) {
  const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);
  useEffect(() => {
    setActiveIndex(props.activeIndex || 0);
  }, [props.activeIndex]);
  return (
    <>
      {props.data?.map((item, index) => {
        return (
          <li
            className={`nav-item ${activeIndex === index ? "active" : ""}`}
            key={index}
          >
            <a
              className={`nav-link text-white`}
              aria-current="page"
              href="#"
              onClick={() => {
                setActiveIndex(index);
                if (item.onClick) {
                  item.onClick();
                }
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <InlineIcon icon={item.icon} fontSize="30px" />
                <span>{item.title}</span>
              </div>
            </a>
          </li>
        );
      })}
    </>
  );
}
