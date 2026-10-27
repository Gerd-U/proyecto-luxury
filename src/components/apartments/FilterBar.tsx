import type { ChangeEvent, FormEvent } from "react";
import { ZONE_POINTS } from "../../data/costaRicaMap";
import type { ApartmentFilters } from "../../types/apartment";
import type { MapZone } from "../../types/map";
import { formatPrice } from "../../utils/formatPrice";
import { PRICE_STEP, type PriceBounds } from "../../utils/filterApartments";
import { getRegion, type Region } from "../../utils/region";
import CostaRicaMap from "./CostaRicaMap";
import "./FilterBar.css";

interface FilterBarProps {
  id: string;
  filters: ApartmentFilters;
  locations: string[];
  locationCounts: Record<string, number>;
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
  { value: null, label: "Todas" },
  { value: 2, label: "2+" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 5, label: "5+" },
];

const REGIONS: Region[] = ["valle", "pacifico"];

const REGION_LABEL: Record<Region, string> = {
  valle: "Valle Central",
  pacifico: "Pacífico",
};

function FilterBar({
  id,
  filters,
  locations,
  locationCounts,
  priceBounds,
  activeCount,
  onChange,
  onClear,
}: FilterBarProps) {
  // Región elegida en el mapa o en el índice; filtra todas sus zonas.
  const focusedRegion = filters.region;
  const priceValue = filters.maxPrice ?? priceBounds.max;

  const zones: MapZone[] = locations.map((location) => {
    const name = location.split(",")[0];
    return {
      location,
      name,
      count: locationCounts[location] ?? 0,
      region: getRegion(location),
      point: ZONE_POINTS[name] ?? null,
    };
  });

  const total = zones.reduce((sum, zone) => sum + zone.count, 0);
  const selectedZone = zones.find((zone) => zone.location === filters.location) ?? null;
  const shownRegion = selectedZone?.region ?? focusedRegion;
  const regionTotal = zones
    .filter((zone) => zone.region === focusedRegion)
    .reduce((sum, zone) => sum + zone.count, 0);

  const currentName = selectedZone?.name ?? (focusedRegion ? REGION_LABEL[focusedRegion] : "Todas las zonas");
  const currentCount = selectedZone?.count ?? (focusedRegion ? regionTotal : total);

  const selectZone = (location: string): void => {
    onChange({ ...filters, location, region: null });
  };

  const selectRegion = (region: Region): void => {
    onChange({ ...filters, location: "", region });
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...filters, search: event.target.value });
  };

  const handleLocation = (event: ChangeEvent<HTMLInputElement>): void => {
    selectZone(event.target.value);
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

  const renderZone = (zone: Pick<MapZone, "location" | "name" | "count">) => (
    <label className="filter-bar__zone" key={zone.location || "todas"}>
      <input
        type="radio"
        name={`${id}-zona`}
        value={zone.location}
        checked={filters.location === zone.location && (zone.location !== "" || focusedRegion === null)}
        onChange={handleLocation}
      />
      <span>
        {zone.name}
        <small>{zone.count}</small>
      </span>
    </label>
  );

  const renderRegion = (region: Region) => {
    const count = zones
      .filter((zone) => zone.region === region)
      .reduce((sum, zone) => sum + zone.count, 0);
    return (
      <label className="filter-bar__zone">
        <input
          type="radio"
          name={`${id}-zona`}
          value={region}
          checked={focusedRegion === region && filters.location === ""}
          onChange={() => selectRegion(region)}
        />
        <span>
          Todo {region === "valle" ? "el Valle Central" : "el Pacífico"}
          <small>{count}</small>
        </span>
      </label>
    );
  };

  return (
    <form id={id} className="filter-bar" onSubmit={handleSubmit} aria-label="Filtros de residencias">
      <div className="filter-bar__map">
        <CostaRicaMap
          zones={zones}
          selected={filters.location}
          focusedRegion={focusedRegion}
          onSelectZone={selectZone}
          onSelectRegion={selectRegion}
        />
      </div>

      <div className="filter-bar__body">
        <div className="filter-bar__current">
          <p className="filter-bar__current-region">
            {shownRegion ? REGION_LABEL[shownRegion] : "Costa Rica"}
          </p>
          <p className="filter-bar__current-name" key={currentName}>
            {currentName}
          </p>
          <p className="filter-bar__current-count">
            {currentCount} {currentCount === 1 ? "residencia" : "residencias"}
          </p>
        </div>

        <fieldset className="filter-bar__group">
          <legend className="filter-bar__legend">Zona</legend>
          {renderZone({ location: "", name: "Toda Costa Rica", count: total })}
          <div className="filter-bar__regions">
            {REGIONS.map((region) => (
              <div
                className={`filter-bar__region${focusedRegion === region ? " is-focused" : ""}`}
                key={region}
              >
                <p className="filter-bar__region-name">{REGION_LABEL[region]}</p>
                {renderRegion(region)}
                {zones.filter((zone) => zone.region === region).map(renderZone)}
              </div>
            ))}
          </div>
        </fieldset>

        <div className="filter-bar__row">
          <fieldset className="filter-bar__group">
            <legend className="filter-bar__legend">Habitaciones</legend>
            <div className="filter-bar__numbers">
              {BEDROOM_OPTIONS.map((option) => (
                <label className="filter-bar__number" key={option.label}>
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
        </div>

        <div className="filter-bar__row filter-bar__row--end">
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

          <button
            className="filter-bar__clear"
            type="button"
            onClick={onClear}
            disabled={activeCount === 0}
          >
            Limpiar filtros{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </form>
  );
}

export default FilterBar;
