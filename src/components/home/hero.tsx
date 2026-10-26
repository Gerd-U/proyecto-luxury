import { Link } from "react-router-dom";
import type { Apartment } from "../../types/apartment";
import type { StyleWithVars } from "../../types/css";
import { formatPrice } from "../../utils/formatPrice";
import "./hero.css";

interface HeroProps {
  isReady: boolean;
  apartments: Apartment[];
}

interface HeroFact {
  label: string;
  value: string;
}

const TITLE_LINES: string[][] = [
  ["Vivir", "donde", "florece"],
  ["Costa", "Rica"],
];

function getFacts(apartments: Apartment[]): HeroFact[] {
  if (apartments.length === 0) {
    return [
      { label: "Residencias", value: "—" },
      { label: "Ubicaciones", value: "—" },
      { label: "Desde", value: "—" },
    ];
  }

  const locations = new Set(apartments.map((apartment) => apartment.location));
  const lowestPrice = Math.min(
    ...apartments.map((apartment) => apartment.price),
  );

  return [
    { label: "Residencias", value: String(apartments.length) },
    { label: "Ubicaciones", value: String(locations.size) },
    { label: "Desde", value: formatPrice(lowestPrice) },
  ];
}

function Hero({ isReady, apartments }: HeroProps) {
  const facts = getFacts(apartments);
  let wordIndex = 0;

  return (
    <section
      className={`hero ${isReady ? "hero--ready" : ""}`}
      aria-labelledby="hero-title"
    >
      <div className="hero__media">
        <img
          src="/images/home/hero-guaria.jpg"
          alt="Piscina infinita frente al océano Pacífico al atardecer"
          fetchPriority="high"
        />
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__content">
        <h1 id="hero-title" className="hero__title">
          {TITLE_LINES.map((line, lineIndex) => (
            <span className="hero__line" key={lineIndex}>
              {line.map((word) => {
                const index = wordIndex++;
                return (
                  <span className="hero__mask" key={word}>
                    <span
                      className="hero__word"
                      style={{ "--i": index } as StyleWithVars}
                    >
                      {word}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="hero__aside">
          <p className="hero__lead">
            Residencias La Guaria ofrece apartamentos y casas de lujo en el
            Valle Central y la costa del Pacífico, elegidos uno por uno.
          </p>

          <div className="hero__actions">
            <Link to="/apartamentos" className="hero__cta">
              Ver residencias
              <span className="hero__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link to="/contacto" className="hero__link">
              Agendar una visita
            </Link>
          </div>
        </div>

        <dl className="hero__facts">
          {facts.map((fact) => (
            <div className="hero__fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Hero;
