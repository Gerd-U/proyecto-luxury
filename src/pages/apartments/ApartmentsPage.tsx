import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BrandMark from "../../components/brand/BrandMark";
import ApartmentCardSkeleton from "../../components/apartments/ApartmentCardSkeleton";
import ApartmentList from "../../components/apartments/ApartmentList";
import FilterBar from "../../components/apartments/FilterBar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Pagination from "../../components/ui/Pagination";
import { useApartments } from "../../hooks/useApartments";
import { DEFAULT_FILTERS, type ApartmentFilters } from "../../types/apartment";
import {
  buildParams,
  countActiveFilters,
  filterApartments,
  getLocationCounts,
  getLocations,
  getPriceBounds,
  readFiltersFromParams,
  readPageFromParams,
} from "../../utils/filterApartments";
import { ITEMS_PER_PAGE, getTotalPages, paginate } from "../../utils/paginate";
import "./ApartmentsPage.css";

const FILTERS_ID = "filtros-catalogo";

function ApartmentsPage() {
  const { apartments, isLoading, error, retry } = useApartments();
  // conserva los filtros en la url al volver del detalle
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo(() => readFiltersFromParams(searchParams), [searchParams]);
  const requestedPage = readPageFromParams(searchParams);

  const locations = useMemo(() => getLocations(apartments), [apartments]);
  const locationCounts = useMemo(() => getLocationCounts(apartments), [apartments]);
  const priceBounds = useMemo(() => getPriceBounds(apartments), [apartments]);

  const filteredApartments = useMemo(
    () => filterApartments(apartments, filters),
    [apartments, filters],
  );

  const totalPages = getTotalPages(filteredApartments.length);
  // limita la página al total de resultados
  const currentPage = Math.min(requestedPage, totalPages);
  const visibleApartments = paginate(filteredApartments, currentPage);
  const activeCount = countActiveFilters(filters);

  const firstShown = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastShown = firstShown + visibleApartments.length - 1;

  const updateFilters = (nextFilters: ApartmentFilters): void => {
    setSearchParams(buildParams(nextFilters, 1), { replace: true });
  };

  const clearFilters = (): void => {
    updateFilters(DEFAULT_FILTERS);
  };

  const changePage = (page: number): void => {
    setSearchParams(buildParams(filters, page));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="catalog">
      <header className="catalog__header">
        <h1 className="catalog__title">Residencias</h1>
        <p className="catalog__intro">
          Apartamentos, penthouses y casas en venta en el Valle Central y el
          Pacífico, elegidos uno por uno.
        </p>
        <p className="catalog__count" aria-live="polite">
          {isLoading
            ? "Cargando el catálogo…"
            : error
              ? "Catálogo no disponible"
              : `${filteredApartments.length} de ${apartments.length} residencias`}
        </p>
      </header>

      <div className="catalog__layout">
        <aside className="catalog__filters">
          <button
            type="button"
            className="catalog__filters-toggle"
            aria-expanded={isPanelOpen}
            aria-controls={FILTERS_ID}
            onClick={() => setIsPanelOpen((open) => !open)}
          >
            <span>Filtros{activeCount > 0 ? ` (${activeCount})` : ""}</span>
            <span className="catalog__filters-icon" aria-hidden="true">
              {isPanelOpen ? "−" : "+"}
            </span>
          </button>

          <div className={`catalog__panel ${isPanelOpen ? "is-open" : ""}`}>
            <FilterBar
              id={FILTERS_ID}
              filters={filters}
              locations={locations}
              locationCounts={locationCounts}
              priceBounds={priceBounds}
              activeCount={activeCount}
              onChange={updateFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <section className="catalog__results" ref={resultsRef} aria-label="Resultados">
          {isLoading ? (
            <ApartmentCardSkeleton />
          ) : error ? (
            <ErrorMessage message={error} onRetry={retry} />
          ) : filteredApartments.length === 0 ? (
            <EmptyState
              icon={<BrandMark size={72} />}
              title="Ninguna residencia coincide"
              message={`Prueba con menos filtros: hay ${activeCount} activos. También puedes buscar por zona o por amenidad, como "piscina".`}
              action={
                <button type="button" className="catalog__clear" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              }
            />
          ) : (
            <>
              <p className="catalog__range">
                Mostrando {firstShown}–{lastShown} de {filteredApartments.length}
              </p>
              <ApartmentList apartments={visibleApartments} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </>
          )}
        </section>
      </div>

      <section className="catalog__contact">
        <h2>¿No ves la que buscas?</h2>
        <p>
          Tenemos residencias que no publicamos. Cuéntanos qué necesitas y te
          mostramos opciones en privado.
        </p>
        <Link to="/contacto" className="catalog__contact-button">
          Hablar con un asesor
        </Link>
      </section>
    </div>
  );
}

export default ApartmentsPage;
