import { Link, useParams } from "react-router-dom";

function ApartmentDetailPage() {
  // Obtiene el ID del apartamento desde la URL
  const { id } = useParams<{ id: string }>();

  return (
    <main className="apartment-detail-page">
      <section className="apartment-detail-header">
        <Link to="/apartamentos" className="back-link">
          ← Volver al catalogo
        </Link>

        <h1>Detalle del apartamento</h1>
        <p>Propiedad seleccionada: {id}</p>
      </section>

      <section className="apartment-detail-content">
        <div className="apartment-detail-gallery">{}</div>

        <div className="apartment-detail-info">
          <h2>Información de la propiedad</h2>

          <div className="apartment-detail-features">{}</div>

          <div className="apartment-detail-actions">
            {}

            <Link
              to={`/contacto?propiedad=${encodeURIComponent(id ?? "")}`}
              className="apartment-contact-button"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ApartmentDetailPage;
