import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentList from "../../components/apartments/ApartmentList";
import FavoriteButton from "../../components/apartments/FavoriteButton";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import { useFavorites } from "../../context/FavoriteContext";
import type { Apartment } from "../../types/apartment";
import "./FavoritesPage.css";

function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApartments() {
      try {
        const response = await fetch("/data/apartments.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los apartamentos.");
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("El archivo de apartamentos no es válido.");
        }

        setApartments(data as Apartment[]);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los apartamentos.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadApartments();
    return () => controller.abort();
  }, []);

  const favorites = apartments.filter((apartment) =>
    favoriteIds.includes(apartment.id),
  );

  return (
    <main className="favorites-page">
      <section className="favorites-header">
        <h1>Mis apartamentos favoritos</h1>
        <p>
          Aquí encontrarás las propiedades que guardaste para consultarlas más
          adelante.
        </p>
      </section>

      <section className="favorites-content">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : favorites.length === 0 ? (
          <div className="favorites-empty">
            <h2>Todavía no tenés favoritos</h2>
            <p>
              Explorá nuestro catálogo y guardá los apartamentos que más te
              gusten.
            </p>
            <Link to="/apartamentos">Explorar apartamentos</Link>
          </div>
        ) : (
          <div className="favorites-list">
            <ApartmentList
              apartments={favorites}
              renderActions={(apartment) => (
                <FavoriteButton apartmentId={apartment.id} />
              )}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default FavoritesPage;
