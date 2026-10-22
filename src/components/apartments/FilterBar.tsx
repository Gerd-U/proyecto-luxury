import type { ApartmentFilters } from "../../types/apartment";

interface FilterBarProps {
  filters: ApartmentFilters;
  locations: string[];
  onChange: (filters: ApartmentFilters) => void;
}

function FilterBar({ filters, locations, onChange }: FilterBarProps) {
  const clearFilters = () => {
    onChange({
      search: "",
      location: "",
      bedrooms: null,
      maxPrice: null,
    });
  };

  return (
    <form
      className="filter-bar"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Filtros de apartamentos"
    >
      <label className="filter-bar__field">
        <span className="filter-bar__label">Buscar</span>
        <input
          className="filter-bar__input"
          type="search"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Nombre o ubicación"
        />
      </label>

      <label className="filter-bar__field">
        <span className="filter-bar__label">Ubicación</span>
        <select
          className="filter-bar__select"
          value={filters.location}
          onChange={(event) =>
            onChange({ ...filters, location: event.target.value })
          }
        >
          <option value="">Todas</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__field">
        <span className="filter-bar__label">Habitaciones mínimas</span>
        <select
          className="filter-bar__select"
          value={filters.bedrooms ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              bedrooms: event.target.value ? Number(event.target.value) : null,
            })
          }
        >
          <option value="">Cualquiera</option>
          {[1, 2, 3, 4].map((bedrooms) => (
            <option key={bedrooms} value={bedrooms}>
              {bedrooms}+
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__field">
        <span className="filter-bar__label">Precio máximo (USD/mes)</span>
        <input
          className="filter-bar__input"
          type="number"
          min="0"
          value={filters.maxPrice ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              maxPrice: event.target.value ? Number(event.target.value) : null,
            })
          }
          placeholder="Sin límite"
        />
      </label>

      <button
        className="filter-bar__clear"
        type="button"
        onClick={clearFilters}
      >
        Limpiar
      </button>
    </form>
  );
}

export default FilterBar;
