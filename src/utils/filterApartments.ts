import {
  DEFAULT_FILTERS,
  type Apartment,
  type ApartmentFilters,
} from "../types/apartment";

export interface PriceBounds {
  min: number;
  max: number;
}

export const PRICE_STEP = 50_000;

/** Claves de los filtros en la URL. */
const PARAM = {
  search: "q",
  location: "zona",
  bedrooms: "hab",
  maxPrice: "max",
  page: "pagina",
} as const;

/** Ignora mayúsculas y tildes al buscar. */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function filterApartments(
  apartments: readonly Apartment[],
  filters: ApartmentFilters,
): Apartment[] {
  const search = normalizeText(filters.search);

  return apartments.filter((apartment) => {
    const searchable = normalizeText(
      [apartment.name, apartment.location, ...apartment.amenities].join(" "),
    );
    const matchesSearch = search === "" || searchable.includes(search);
    const matchesLocation =
      filters.location === "" || apartment.location === filters.location;
    const matchesBedrooms =
      filters.bedrooms === null || apartment.bedrooms >= filters.bedrooms;
    const matchesPrice =
      filters.maxPrice === null || apartment.price <= filters.maxPrice;

    return matchesSearch && matchesLocation && matchesBedrooms && matchesPrice;
  });
}

export function countActiveFilters(filters: ApartmentFilters): number {
  return [
    filters.search.trim() !== "",
    filters.location !== "",
    filters.bedrooms !== null,
    filters.maxPrice !== null,
  ].filter(Boolean).length;
}

export function getLocations(apartments: readonly Apartment[]): string[] {
  return [...new Set(apartments.map((apartment) => apartment.location))].sort(
    (first, second) => first.localeCompare(second, "es"),
  );
}

export function getPriceBounds(apartments: readonly Apartment[]): PriceBounds {
  if (apartments.length === 0) {
    return { min: 0, max: PRICE_STEP };
  }
  const prices = apartments.map((apartment) => apartment.price);
  return {
    min: Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP,
    max: Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP,
  };
}

function readNumber(value: string | null): number | null {
  if (value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Los parámetros no válidos se ignoran. */
export function readFiltersFromParams(params: URLSearchParams): ApartmentFilters {
  return {
    search: params.get(PARAM.search) ?? DEFAULT_FILTERS.search,
    location: params.get(PARAM.location) ?? DEFAULT_FILTERS.location,
    bedrooms: readNumber(params.get(PARAM.bedrooms)),
    maxPrice: readNumber(params.get(PARAM.maxPrice)),
  };
}

export function readPageFromParams(params: URLSearchParams): number {
  return Math.max(1, Math.floor(readNumber(params.get(PARAM.page)) ?? 1));
}

export function buildParams(filters: ApartmentFilters, page: number): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search.trim() !== "") params.set(PARAM.search, filters.search);
  if (filters.location !== "") params.set(PARAM.location, filters.location);
  if (filters.bedrooms !== null) params.set(PARAM.bedrooms, String(filters.bedrooms));
  if (filters.maxPrice !== null) params.set(PARAM.maxPrice, String(filters.maxPrice));
  if (page > 1) params.set(PARAM.page, String(page));
  return params;
}
