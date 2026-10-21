import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Apartment } from '../../types/apartment';
import { formatPrice } from '../../utils/formatPrice';
import './ApartmentCard.css';

interface ApartmentCardProps {
  apartment: Apartment;
 
  actions?: ReactNode;
}

export default function ApartmentCard({ apartment, actions }: ApartmentCardProps) {
  const { id, name, location, price, image, bedrooms, bathrooms, area } = apartment;

  return (
    <article className="apartment-card">
      <div className="apartment-card__media">
        <img
          className="apartment-card__image"
          src={image}
          alt={`Fachada de ${name}`}
          loading="lazy"
        />
        {actions && <div className="apartment-card__actions">{actions}</div>}
      </div>

      <div className="apartment-card__body">
        <h3 className="apartment-card__title">{name}</h3>
        <p className="apartment-card__location">{location}</p>

        <ul className="apartment-card__specs">
          <li>{bedrooms} hab.</li>
          <li>{bathrooms} baños</li>
          <li>{area} m²</li>
        </ul>

        <div className="apartment-card__footer">
          <p className="apartment-card__price">
            {formatPrice(price)} <span>/ mes</span>
          </p>
          <Link className="apartment-card__link" to={`/apartamentos/${id}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
