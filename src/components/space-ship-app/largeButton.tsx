import * as React from "react";
import { Icon } from "@iconify/react";

export interface LargeButtonProps {
  icon?: string;
  text?: string;
  iconColor?: string;
  iconSize?: string;
}

export default function LargeButton({
  icon = "mdi:rocket",
  text = "Launch",
  iconColor = "white",
  iconSize = "40px",
}: LargeButtonProps) {
  return (
    <button className="large-button p-2 d-block">
      <div className="d-flex flex-column gap-2 align-items-center">
        {icon && (
          <Icon icon={icon} color={iconColor} fontSize={iconSize} />
        )}
        <span className="lb-label">{text}</span>
      </div>
    </button>
  );
}
