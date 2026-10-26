import type { StyleWithVars } from "../../types/css";
import "./BrandMark.css";

interface BrandMarkProps {
  /** Tamaño en píxeles (ancho y alto). */
  size?: number;
  /** Si se da, el logo se anuncia a lectores de pantalla con este texto. */
  title?: string;
  /** Activa la animación de pétalos que se abren (la usa el loader). */
  animated?: boolean;
  className?: string;
}

interface Petal {
  d: string;
  /** Rotación alrededor del centro de la flor, en grados. */
  rotate: number;
}

/*
 * La guaria morada (Guarianthe skinneri), flor nacional de Costa Rica, simplificada:
 * un sépalo arriba, dos pétalos anchos a los lados, dos sépalos abajo y el labelo
 * (la "boca" de la orquídea) en un morado más profundo con la garganta clara.
 */
const SEPAL = "M32 30 C28 22 28 11 32 5 C36 11 36 22 32 30 Z";
const PETAL_LEFT = "M30 31 C22 31 11 26 7 18 C16 16 26 21 30 31 Z";
const PETAL_RIGHT = "M34 31 C42 31 53 26 57 18 C48 16 38 21 34 31 Z";
const LIP = "M32 34 C25 37 24 48 32 53 C40 48 39 37 32 34 Z";
const THROAT = "M32 37 C29.5 39 29.5 43 32 45 C34.5 43 34.5 39 32 37 Z";

const PETALS: Petal[] = [
  { d: SEPAL, rotate: 0 },
  { d: PETAL_LEFT, rotate: 0 },
  { d: PETAL_RIGHT, rotate: 0 },
  { d: SEPAL, rotate: 140 },
  { d: SEPAL, rotate: -140 },
];

function BrandMark({ size = 40, title, animated = false, className = "" }: BrandMarkProps) {
  const classes = ["brand-mark", animated ? "brand-mark--animated" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {PETALS.map((petal, index) => (
        <path
          key={index}
          className="brand-mark__petal"
          d={petal.d}
          transform={`rotate(${petal.rotate} 32 32)`}
          pathLength={1}
          style={{ "--i": index } as StyleWithVars}
        />
      ))}
      <path className="brand-mark__lip" d={LIP} />
      <path className="brand-mark__throat" d={THROAT} />
    </svg>
  );
}

export default BrandMark;
