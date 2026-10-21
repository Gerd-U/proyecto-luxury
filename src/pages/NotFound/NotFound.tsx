import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <main className="notfound">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>

        <p>Parece que la página que estás buscando no existe.</p>

        <a href="/" className="notfound-button">
          Volver a la página principal
        </a>
      </div>
    </main>
  );
}

export default NotFoundPage;
