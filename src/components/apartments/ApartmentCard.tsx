import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import type { Apartment } from "../../types/apartment";
import { formatPrice } from "../../utils/formatPrice";
import {
  canUseViewTransition,
  getImageTransitionName,
  isPlainLeftClick,
  runViewTransition,
} from "../../utils/viewTransition";
import "./ApartmentCard.css";

export interface DetailLinkState {
  from: string;
}

interface ApartmentCardProps {
  apartment: Apartment;
  reverse?: boolean;
  onFavoriteChange?: (apartment: Apartment, isNowFavorite: boolean) => void;
}

const VISIBLE_AMENITIES = 3;

export default function ApartmentCard({
  apartment,
  reverse = false,
  onFavoriteChange,
}: ApartmentCardProps) {
  const { id, name, location, price, image, description, bedrooms, bathrooms, area, amenities } =
    apartment;
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const detailPath = `/apartamentos/${id}`;
  const linkState: DetailLinkState = {
    from: currentLocation.pathname + currentLocation.search,
  };
  const shownAmenities = amenities.slice(0, VISIBLE_AMENITIES);
  const hiddenAmenities = amenities.length - shownAmenities.length;

  // La transición es opcional; el enlace funciona igual sin ella.
  const handleOpen = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (!isPlainLeftClick(event) || !canUseViewTransition()) {
      return;
    }
    event.preventDefault();
    runViewTransition(() => navigate(detailPath, { state: linkState }));
  };

  return (
    <article className={`apartment-card ${reverse ? "apartment-card--reverse" : ""}`}>
      <div className="apartment-card__media">
        <img
          className="apartment-card__image"
          src={image}
          alt={`${name}, ${location}`}
          loading="lazy"
          style={{ viewTransitionName: getImageTransitionName(id) }}
        />
        <div className="apartment-card__favorite">
          <FavoriteButton
            apartmentId={id}
            apartmentName={name}
            onToggle={(isNowFavorite) => onFavoriteChange?.(apartment, isNowFavorite)}
          />
        </div>
      </div>

      <div className="apartment-card__body">
        <p className="apartment-card__location">{location}</p>
        <h2 className="apartment-card__title">
          {/* El enlace cubre toda la card. */}
          <Link
            to={detailPath}
            state={linkState}
            className="apartment-card__link"
            onClick={handleOpen}
          >
            {name}
          </Link>
        </h2>
        <p className="apartment-card__description">{description}</p>

        <dl className="apartment-card__facts">
          <div>
            <dt>Habitaciones</dt>
            <dd>{bedrooms}</dd>
          </div>
          <div>
            <dt>Baños</dt>
            <dd>{bathrooms}</dd>
          </div>
          <div>
            <dt>Área</dt>
            <dd>
              {area}
              <span> m²</span>
            </dd>
          </div>
        </dl>

        <ul className="apartment-card__amenities" aria-label="Amenidades">
          {shownAmenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
          {hiddenAmenities > 0 && (
            <li className="apartment-card__more">+{hiddenAmenities} más</li>
          )}
        </ul>

        <div className="apartment-card__footer">
          <p className="apartment-card__price">
            <span>Precio de venta</span>
            {formatPrice(price)}
          </p>
          <span className="apartment-card__cta" aria-hidden="true">
            Ver residencia <span className="apartment-card__arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
