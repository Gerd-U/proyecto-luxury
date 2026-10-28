import type { Region } from '../utils/region';

export interface Apartment {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  gallery?: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  featured?: boolean;
}

export interface ApartmentFilters {
  search: string;
  location: string;
  region: Region | null;
  bedrooms: number | null;
  maxPrice: number | null;
}

export const DEFAULT_FILTERS: ApartmentFilters = {
  search: '',
  location: '',
  region: null,
  bedrooms: null,
  maxPrice: null,
};
