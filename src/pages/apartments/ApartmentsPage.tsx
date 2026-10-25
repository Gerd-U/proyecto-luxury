import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentList from "../../components/apartments/ApartmentList";
import FilterBar from "../../components/apartments/FilterBar";
import FavoriteButton from "../../components/apartments/FavoriteButton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import { useApartments } from "../../hooks/useApartments";
import { DEFAULT_FILTERS, type ApartmentFilters } from "../../types/apartment";
import { getTotalPages, paginate } from "../../utils/paginate";
import "../../components/apartments/FilterBar.css";
import "./ApartmentsPage.css";

function ApartmentsPage() {
  const { apartments, isLoading, error, retry } = useApartments();
  const [filters, setFilters] = useState<ApartmentFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const locations = useMemo(
    () =>
      [...new Set(apartments.map((apartment) => apartment.location))].sort(
        (first, second) => first.localeCompare(second, "es"),
      ),
    [apartments],
  );

  const filteredApartments = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase();

    return apartments.filter((apartment) => {
      const matchesSearch =
        !search ||
        apartment.name.toLocaleLowerCase().includes(search) ||
        apartment.location.toLocaleLowerCase().includes(search);
      const matchesLocation =
        !filters.location || apartment.location === filters.location;
      const matchesBedrooms =
        filters.bedrooms === null || apartment.bedrooms >= filters.bedrooms;
      const matchesPrice =
        filters.maxPrice === null || apartment.price <= filters.maxPrice;

      return (
        matchesSearch && matchesLocation && matchesBedrooms && matchesPrice
      );
    });
  }, [apartments, filters]);

  const totalPages = getTotalPages(filteredApartments.length);
  const visibleApartments = paginate(filteredApartments, currentPage);

  const updateFilters = (nextFilters: ApartmentFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  return (
    <div className="apartments-page">
      <section className="apartments-header">
        <h1>Encuentra tu próximo hogar</h1>
        <p>
          Explora nuestra colección de apartamentos exclusivos y encuentra el
          espacio ideal para tus gustos.
        </p>
      </section>

      <section className="apartments-catalog">
        <FilterBar
          filters={filters}
          locations={locations}
          onChange={updateFilters}
        />

        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : filteredApartments.length === 0 ? (
          <EmptyState
            title="No encontramos apartamentos"
            message="Probá cambiar o limpiar los filtros."
            action={
              <button
                className="filter-bar__clear"
                type="button"
                onClick={() => updateFilters(DEFAULT_FILTERS)}
              >
                Limpiar filtros
              </button>
            }
          />
        ) : (
          <>
            <ApartmentList
              apartments={visibleApartments}
              renderActions={(apartment) => (
                <FavoriteButton apartmentId={apartment.id} />
              )}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>

      <section className="apartments-contact">
        <h2>¿Necesitas asesoramiento o ayuda de algun tipo?</h2>
        <p>
          Nuestro equipo puede ayudarte a encontrar el apartamento que estás
          buscando.
        </p>
        <Link to="/contacto" className="apartments-contact-button">
          Contáctanos
        </Link>
      </section>
    </div>
  );
}

export default ApartmentsPage;
