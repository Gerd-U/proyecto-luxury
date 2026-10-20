import { Link } from "react-router-dom";

function ApartmentsPage() {
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
        <div className="apartments-filters">{}</div>

        <div className="apartments-list">{}</div>

        <div className="apartments-pagination">{}</div>
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
