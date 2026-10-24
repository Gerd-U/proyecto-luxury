import type { CSSProperties } from "react";

/**
 * Estilos en línea que además aceptan variables CSS, por ejemplo
 * style={{ "--i": 2 }}. Sirve para escalonar animaciones desde React
 * sin usar "any".
 */
export type StyleWithVars = CSSProperties & {
  [variable: `--${string}`]: string | number;
};
