import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "../apartments/FavoriteButton";
import EmptyState from "../ui/EmptyState";
import ErrorMessage from "../ui/ErrorMessage";
import Loader from "../ui/Loader";
import type { Apartment } from "../../types/apartment";
import type { StyleWithVars } from "../../types/css";
import { formatPrice } from "../../utils/formatPrice";
import {
  REGION_OPTIONS,
  getRegion,
  type RegionFilter,
} from "../../utils/region";
import "./FeaturedApartments.css";

interface FeaturedApartmentsProps {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function FeaturedApartments({
  apartments,
  isLoading,
  error,
  onRetry,
}: FeaturedApartmentsProps) {
  const [region, setRegion] = useState<RegionFilter>("todas");

  const featured = useMemo(
    () => apartments.filter((apartment) => apartment.featured === true),
    [apartments],
  );

  const visible = useMemo(
    () =>
      region === "todas"
        ? featured
        : featured.filter(
            (apartment) => getRegion(apartment.location) === region,
          ),
    [featured, region],
  );

  const countFor = (value: RegionFilter): number =>
    value === "todas"
      ? featured.length
      : featured.filter((apartment) => getRegion(apartment.location) === value)
          .length;

  return (
    <section className="featured" aria-labelledby="featured-title">
      <div className="featured__inner">
        <div className="featured__head">
          <h2 id="featured-title" className="featured__title">
            Residencias destacadas
          </h2>

          <div
            className="featured__filter"
            role="group"
            aria-label="Filtrar por región"
          >
            {REGION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="featured__chip"
                aria-pressed={region === option.value}
                onClick={() => setRegion(option.value)}
              >
                {option.label}
                <span className="featured__count">
                  {countFor(option.value)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Loader message="Cargando residencias destacadas…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={onRetry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No hay destacadas en esta región"
            message="Mira las de otra zona o el catálogo completo."
            action={
              <button
                type="button"
                className="featured__chip"
                onClick={() => setRegion("todas")}
              >
                Ver todas
              </button>
            }
          />
        ) : (
          <ul className="featured__list" key={region}>
            {visible.map((apartment, index) => {
              const isLead = index === 0 || visible.length === 2;

              return (
                <li
                  key={apartment.id}
                  className={`featured__item ${isLead ? "featured__item--lead" : ""}`}
                  style={{ "--i": index } as StyleWithVars}
                >
                  <figure className="featured__media">
                    <img
                      src={apartment.image}
                      alt={`${apartment.name}, ${apartment.location}`}
                      loading="lazy"
                    />
                    <div className="featured__favorite">
                      <FavoriteButton apartmentId={apartment.id} />
                    </div>
                  </figure>

                  <div className="featured__body">
                    <p className="featured__location">{apartment.location}</p>
                    <h3 className="featured__name">{apartment.name}</h3>
                    <p className="featured__specs">
                      {apartment.bedrooms} habitaciones · {apartment.bathrooms}{" "}
                      baños · {apartment.area} m²
                    </p>
                    <p className="featured__price">
                      {formatPrice(apartment.price)} <span>/ mes</span>
                    </p>
                    <Link
                      to={`/apartamentos/${apartment.id}`}
                      className="featured__link"
                      aria-label={`Ver detalle de ${apartment.name}`}
                    >
                      Ver residencia <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link to="/apartamentos" className="featured__all">
          Ver el catálogo completo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

export default FeaturedApartments;
