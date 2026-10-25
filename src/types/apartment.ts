export interface Apartment {
  id: number;
  name: string;
  location: string;
  /** Precio en USD. */
  price: number;
  image: string;
  gallery?: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  /** Área en m². */
  area: number;
  amenities: string[];
  featured?: boolean;
}

export interface ApartmentFilters {
  search: string;
  location: string;
  /** null significa que no hay mínimo. */
  bedrooms: number | null;
  /** null significa que no hay máximo. */
  maxPrice: number | null;
}

export const DEFAULT_FILTERS: ApartmentFilters = {
  search: '',
  location: '',
  bedrooms: null,
  maxPrice: null,
};
