export interface Apartment {
  id: number;
  name: string;
  location: string;
  /** Precio mensual en USD */
  price: number;
  image: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  /** Área en metros cuadrados */
  area: number;
  amenities: string[];
  featured?: boolean;
}

export interface ApartmentFilters {
  search: string;
  /** Cadena vacía = todas las ubicaciones */
  location: string;
  /** null = sin filtro de habitaciones */
  bedrooms: number | null;
  /** null = sin precio máximo */
  maxPrice: number | null;
}

export const DEFAULT_FILTERS: ApartmentFilters = {
  search: '',
  location: '',
  bedrooms: null,
  maxPrice: null,
};
