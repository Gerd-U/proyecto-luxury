import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>

        <p>Parece que la página que estás buscando no existe.</p>

        <Link to="/" className="notfound-button">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
