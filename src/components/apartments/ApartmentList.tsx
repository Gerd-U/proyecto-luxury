import type { ReactNode } from 'react';
import type { Apartment } from '../../types/apartment';
import ApartmentCard from './ApartmentCard';

interface ApartmentListProps {
  apartments: Apartment[];
  
  renderActions?: (apartment: Apartment) => ReactNode;
}

export default function ApartmentList({ apartments, renderActions }: ApartmentListProps) {
  return (
    <div className="apartment-list">
      {apartments.map((apartment) => (
        <ApartmentCard
          key={apartment.id}
          apartment={apartment}
          actions={renderActions?.(apartment)}
        />
      ))}
    </div>
  );
}
