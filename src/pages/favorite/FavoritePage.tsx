import { Link } from "react-router-dom";
import "./FavoritesPage.css";

function FavoritesPage() {
  //Context de favoritos
  const favorites: string[] = [];

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
        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <h2>Todavía no tenés favoritos</h2>
            <p>
              Explorá nuestro catálogo y guardá los apartamentos que más te
              gusten.
            </p>

            <Link to="/apartamentos">Explorar apartamentos</Link>
          </div>
        ) : (
          <div className="favorites-list">{/* Context de favoritos */}</div>
        )}
      </section>
    </main>
  );
}

export default FavoritesPage;
