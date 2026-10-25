import type { Apartment } from "../../types/apartment";
import type { StyleWithVars } from "../../types/css";
import { formatPrice } from "../../utils/formatPrice";
import "./KeyFacts.css";

interface KeyFactsProps {
  apartment: Apartment;
  catalog: Apartment[];
  isVisible: boolean;
}

type FactKey = "bedrooms" | "bathrooms" | "area" | "price";

interface FactDefinition {
  key: FactKey;
  label: string;
  format: (value: number) => string;
  rankText: (rank: number, total: number) => string;
}

interface FactView extends FactDefinition {
  value: number;
  ratio: number;
  rank: number;
}

const FACTS: FactDefinition[] = [
  {
    key: "bedrooms",
    label: "Habitaciones",
    format: String,
    rankText: (rank, total) => `${rank}.ª con más habitaciones de ${total}`,
  },
  {
    key: "bathrooms",
    label: "Baños",
    format: String,
    rankText: (rank, total) => `${rank}.ª con más baños de ${total}`,
  },
  {
    key: "area",
    label: "Área",
    format: (value) => `${value.toLocaleString("es-CR")} m²`,
    rankText: (rank, total) => `${rank}.ª más amplia de ${total}`,
  },
  {
    key: "price",
    label: "Precio de venta",
    format: formatPrice,
    rankText: (rank, total) => `${rank}.ª de mayor valor de ${total}`,
  },
];

/** Los valores iguales comparten puesto. */
function getRank(value: number, values: number[]): number {
  return values.filter((other) => other > value).length + 1;
}

function buildFacts(apartment: Apartment, catalog: Apartment[]): FactView[] {
  return FACTS.map((fact) => {
    const values = catalog.map((item) => item[fact.key]);
    const max = Math.max(...values, 1);
    const value = apartment[fact.key];
    return { ...fact, value, ratio: value / max, rank: getRank(value, values) };
  });
}

function KeyFacts({ apartment, catalog, isVisible }: KeyFactsProps) {
  const facts = buildFacts(apartment, catalog);

  return (
    <dl className={`key-facts ${isVisible ? "key-facts--visible" : ""}`}>
      {facts.map((fact, index) => (
        <div
          className="key-facts__item"
          key={fact.key}
          style={{ "--ratio": fact.ratio, "--i": index } as StyleWithVars}
        >
          <dt className="key-facts__label">{fact.label}</dt>
          <dd className="key-facts__value">{fact.format(fact.value)}</dd>
          <dd className="key-facts__bar" aria-hidden="true">
            <span />
          </dd>
          <dd className="key-facts__rank">{fact.rankText(fact.rank, catalog.length)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default KeyFacts;
