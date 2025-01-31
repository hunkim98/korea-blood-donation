// TooltipPortal.tsx
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}

// We assume you've got a <div id="tooltip-root"></div> in your HTML:
const tooltipRoot = document.getElementById("tooltip-root");

export function TooltipPortal({ children }: Props) {
  if (!tooltipRoot) return null;
  return createPortal(children, tooltipRoot);
}
