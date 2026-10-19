import "./ValueProposition.css";

function ValueProposition() {
  return (
    <section className="value-section">
      <h2>¿Por qué elegirnos?</h2>
      <p className="value-description">
        Ofrecemos espacios exclusivos diseñados para brindar comodidad,
        elegancia y bienestar.
      </p>

      <div className="value-container">
        <article className="value-card">
          <h3>Ubicaciones exclusivas</h3>
          <p>Apartamentos ubicados en zonas privilegiadas.</p>
        </article>

        <article className="value-card">
          <h3>Diseño moderno</h3>
          <p>Espacios elegantes con acabados de alta calidad.</p>
        </article>

        <article className="value-card">
          <h3>Comodidad y seguridad</h3>
          <p>Ambientes diseñados para vivir con tranquilidad.</p>
        </article>
      </div>
    </section>
  );
}

export default ValueProposition;
