import BrandMark from "../brand/BrandMark";
import type { Apartment } from "../../types/apartment";
import type { Motivo } from "../../types/contact";
import { MOTIVO_LABEL } from "../../types/contact";

import "./VisitCard.css";

const FOTO_RESPALDO = "/images/home/hero-guaria.jpg";

interface VisitCardProps {
  apartment?: Apartment;
  nombre: string;
  motivo: Motivo;
  confirmada?: boolean;
}

function VisitCard({
  apartment,
  nombre,
  motivo,
  confirmada = false,
}: VisitCardProps) {
  const primerNombre = nombre.trim().split(/\s+/)[0] ?? "";

  return (
    <article
      className={`visit-card${confirmada ? " visit-card--confirmada" : ""}`}
      aria-hidden={confirmada ? undefined : true}
      aria-label={confirmada ? "Resumen de tu consulta" : undefined}
    >
      <div className="visit-card__media">
        <img
          key={apartment?.id ?? "respaldo"}
          className="visit-card__photo"
          src={apartment?.image ?? FOTO_RESPALDO}
          alt=""
        />
      </div>

      <div className="visit-card__body">
        <p className="visit-card__kicker">{MOTIVO_LABEL[motivo]}</p>
        <p className="visit-card__title">
          {apartment?.name ?? "Una residencia por descubrir"}
        </p>
        <p className="visit-card__place">
          {apartment?.location ?? "Te recomendamos la ideal para ti"}
        </p>

        <dl className="visit-card__details">
          <div className="visit-card__row">
            <dt>Para</dt>
            <dd className={primerNombre ? undefined : "visit-card__empty"}>
              {primerNombre || "tu nombre"}
            </dd>
          </div>
        </dl>
      </div>

      {confirmada && (
        <div className="visit-card__seal">
          <BrandMark size={48} className="visit-card__seal-mark" />
          <span className="visit-card__seal-text">Simulada</span>
        </div>
      )}
    </article>
  );
}

export default VisitCard;
