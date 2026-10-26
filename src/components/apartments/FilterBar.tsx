import type { ChangeEvent, FormEvent } from "react";
import type { ApartmentFilters } from "../../types/apartment";
import { formatPrice } from "../../utils/formatPrice";
import { PRICE_STEP, type PriceBounds } from "../../utils/filterApartments";
import "./FilterBar.css";

interface FilterBarProps {
  id: string;
  filters: ApartmentFilters;
  locations: string[];
  priceBounds: PriceBounds;
  activeCount: number;
  onChange: (filters: ApartmentFilters) => void;
  onClear: () => void;
}

interface BedroomOption {
  value: number | null;
  label: string;
}

const BEDROOM_OPTIONS: BedroomOption[] = [
  { value: null, label: "Cualquiera" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
];

function FilterBar({
  id,
  filters,
  locations,
  priceBounds,
  activeCount,
  onChange,
  onClear,
}: FilterBarProps) {
  const priceValue = filters.maxPrice ?? priceBounds.max;

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...filters, search: event.target.value });
  };

  const handleLocation = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...filters, location: event.target.value });
  };

  const handleBedrooms = (value: number | null): void => {
    onChange({ ...filters, bedrooms: value });
  };

  const handlePrice = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    onChange({ ...filters, maxPrice: value >= priceBounds.max ? null : value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <form id={id} className="filter-bar" onSubmit={handleSubmit} aria-label="Filtros de residencias">
      <div className="filter-bar__group">
        <label className="filter-bar__legend" htmlFor={`${id}-buscar`}>
          Buscar
        </label>
        <input
          id={`${id}-buscar`}
          className="filter-bar__search"
          type="search"
          value={filters.search}
          onChange={handleSearch}
          placeholder="Nombre, zona o amenidad"
          autoComplete="off"
        />
      </div>

      <fieldset className="filter-bar__group">
        <legend className="filter-bar__legend">Zona</legend>
        <div className="filter-bar__pills">
          {["", ...locations].map((location) => (
            <label className="filter-bar__pill" key={location || "todas"}>
              <input
                type="radio"
                name={`${id}-zona`}
                value={location}
                checked={filters.location === location}
                onChange={handleLocation}
              />
              <span>{location === "" ? "Todas" : location.split(",")[0]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filter-bar__group">
        <legend className="filter-bar__legend">Habitaciones</legend>
        <div className="filter-bar__pills filter-bar__pills--compact">
          {BEDROOM_OPTIONS.map((option) => (
            <label className="filter-bar__pill" key={option.label}>
              <input
                type="radio"
                name={`${id}-habitaciones`}
                checked={filters.bedrooms === option.value}
                onChange={() => handleBedrooms(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="filter-bar__group">
        <div className="filter-bar__price-head">
          <label className="filter-bar__legend" htmlFor={`${id}-precio`}>
            Precio máximo
          </label>
          <output className="filter-bar__price-value" htmlFor={`${id}-precio`}>
            {filters.maxPrice === null ? "Sin límite" : formatPrice(filters.maxPrice)}
          </output>
        </div>
        <input
          id={`${id}-precio`}
          className="filter-bar__range"
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={PRICE_STEP}
          value={priceValue}
          onChange={handlePrice}
          aria-valuetext={
            filters.maxPrice === null ? "Sin límite" : formatPrice(filters.maxPrice)
          }
        />
        <div className="filter-bar__range-limits" aria-hidden="true">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
      </div>

      <button
        className="filter-bar__clear"
        type="button"
        onClick={onClear}
        disabled={activeCount === 0}
      >
        Limpiar filtros{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>
    </form>
  );
}

export default FilterBar;
