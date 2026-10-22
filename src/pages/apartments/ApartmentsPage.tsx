import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentList from "../../components/apartments/ApartmentList";
import "../../components/apartments/FilterBar.css";
import FilterBar from "../../components/apartments/FilterBar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import {
  DEFAULT_FILTERS,
  type Apartment,
  type ApartmentFilters,
} from "../../types/apartment";
import { getTotalPages, paginate } from "../../utils/paginate";
import "./ApartmentsPage.css";

function isApartment(value: unknown): value is Apartment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "location" in value &&
    typeof value.location === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "image" in value &&
    typeof value.image === "string" &&
    "description" in value &&
    typeof value.description === "string" &&
    "bedrooms" in value &&
    typeof value.bedrooms === "number" &&
    "bathrooms" in value &&
    typeof value.bathrooms === "number" &&
    "area" in value &&
    typeof value.area === "number" &&
    "amenities" in value &&
    Array.isArray(value.amenities) &&
    value.amenities.every((amenity) => typeof amenity === "string") &&
    (!("featured" in value) || typeof value.featured === "boolean")
  );
}

function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filters, setFilters] = useState<ApartmentFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApartments() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/data/apartments.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Error al cargar apartamentos (${response.status})`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isApartment)) {
          throw new Error("El archivo de apartamentos tiene un formato inválido.");
        }

        setApartments(data);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los apartamentos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadApartments();
    return () => controller.abort();
  }, [loadAttempt]);

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
    <main className="apartments-page">
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
          <ErrorMessage
            message={error}
            onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
          />
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
            <ApartmentList apartments={visibleApartments} />
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
    </main>
  );
}

export default ApartmentsPage;
