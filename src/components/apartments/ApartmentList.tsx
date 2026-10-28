import type { Apartment } from '../../types/apartment';
import ApartmentCard from './ApartmentCard';

interface ApartmentListProps {
  apartments: Apartment[];
  onFavoriteChange?: (apartment: Apartment, isNowFavorite: boolean) => void;
}

export default function ApartmentList({ apartments, onFavoriteChange }: ApartmentListProps) {
  return (
    <ul className="apartment-list">
      {apartments.map((apartment, index) => (
        <li key={apartment.id} className="apartment-list__item">
          <ApartmentCard
            apartment={apartment}
            reverse={index % 2 === 1}
            onFavoriteChange={onFavoriteChange}
          />
        </li>
      ))}
    </ul>
  );
}
