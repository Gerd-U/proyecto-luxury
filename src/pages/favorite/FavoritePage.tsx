import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../../components/brand/BrandMark";
import ApartmentCardSkeleton from "../../components/apartments/ApartmentCardSkeleton";
import ApartmentList from "../../components/apartments/ApartmentList";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useFavorites } from "../../context/FavoriteContext";
import { useApartments } from "../../hooks/useApartments";
import type { Apartment } from "../../types/apartment";
import "./FavoritesPage.css";

const UNDO_MS = 6000;

function FavoritesPage() {
  const { apartments, isLoading, error, retry } = useApartments();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [removed, setRemoved] = useState<Apartment | null>(null);

  const favorites = useMemo(
    () =>
      favoriteIds
        .map((id) => apartments.find((apartment) => apartment.id === id))
        .filter((apartment): apartment is Apartment => apartment !== undefined),
    [apartments, favoriteIds],
  );

  const suggestions = useMemo(
    () => apartments.filter((apartment) => apartment.featured === true).slice(0, 3),
    [apartments],
  );

  useEffect(() => {
    if (!removed) {
      return;
    }
    const timer = window.setTimeout(() => setRemoved(null), UNDO_MS);
    return () => window.clearTimeout(timer);
  }, [removed]);

  const handleFavoriteChange = (apartment: Apartment, isNowFavorite: boolean): void => {
    setRemoved(isNowFavorite ? null : apartment);
  };

  const undoRemove = (): void => {
    if (removed) {
      toggleFavorite(removed.id);
      setRemoved(null);
    }
  };

  const count = favorites.length;

  return (
    <div className="favorites">
      <header className="favorites__header">
        <h1 className="favorites__title">Tu colección</h1>
        <p className="favorites__count">
          {isLoading
            ? "Cargando…"
            : count === 1
              ? "1 residencia guardada"
              : `${count} residencias guardadas`}
        </p>
      </header>

      {isLoading ? (
        <ApartmentCardSkeleton count={2} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : count === 0 ? (
        <section className="favorites__empty" aria-labelledby="favoritos-vacio">
          <BrandMark size={120} className="favorites__empty-mark" />
          <h2 id="favoritos-vacio" className="favorites__empty-title">
            Tu colección está por florecer
          </h2>
          <p className="favorites__empty-text">
            Toca el corazón de cualquier residencia y la guardamos aquí, incluso
            si cierras la app.
          </p>
          <Link to="/apartamentos" className="favorites__cta">
            Explorar el catálogo
          </Link>

          {suggestions.length > 0 && (
            <div className="favorites__suggestions">
              <h3 className="favorites__suggestions-title">Para empezar</h3>
              <ul className="favorites__suggestion-list">
                {suggestions.map((apartment) => (
                  <li key={apartment.id}>
                    <Link
                      to={`/apartamentos/${apartment.id}`}
                      state={{ from: "/favoritos" }}
                      className="favorites__suggestion"
                    >
                      <img src={apartment.image} alt="" loading="lazy" />
                      <span className="favorites__suggestion-name">{apartment.name}</span>
                      <span className="favorites__suggestion-place">{apartment.location}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <ApartmentList apartments={favorites} onFavoriteChange={handleFavoriteChange} />
      )}

      <div className="favorites__toast-region" aria-live="polite">
        {removed && (
          <div className="favorites__toast">
            <p>
              Quitaste <strong>{removed.name}</strong>
            </p>
            <button type="button" className="favorites__undo" onClick={undoRemove}>
              Deshacer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
