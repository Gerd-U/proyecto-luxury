import type { CSSProperties } from "react";

// admite variables css sin usar any
export type StyleWithVars = CSSProperties & {
  [variable: `--${string}`]: string | number;
};
