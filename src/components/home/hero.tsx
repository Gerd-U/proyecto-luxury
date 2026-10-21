import { Link } from "react-router-dom";
import "./hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Disfruta la vida que <span className="highlight">tú</span> mereces
        </h1>

        <p>
          Encuentra apartamentos exclusivos diseñados para ofrecer comodidad,
          elegancia y calidad de vida.
        </p>

        <Link to="/apartamentos" className="hero-button">
          Explorar apartamentos
        </Link>
      </div>
    </section>
  );
}

export default Hero;