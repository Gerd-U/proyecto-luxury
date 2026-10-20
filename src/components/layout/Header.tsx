import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

//COLOCAR IMAGEN DE LOGO EN LA CARPETA ASSETS Y CAMBIAR EL NOMBRE DE LA MARCA
import logo from "../../assets/hero.png";

//CSS COMENTADO POR QUE TODAVIA NO ESTA CREADO
//import "./Header.css";

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Inicio" },
  { to: "/apartamentos", label: "Apartamentos" },
  { to: "/favoritos", label: "Favoritos" },
  { to: "/contacto", label: "Contacto" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <img src={logo} alt="" className="header__logo" />
          <span className="header__name">Nombre de tu marca</span>
        </Link>

        <button
          type="button"
          className={`header__toggle ${isMenuOpen ? "is-open" : ""}`}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          onClick={toggleMenu}
        >
          <span className="header__bar" />
          <span className="header__bar" />
          <span className="header__bar" />
        </button>

        <nav
          id="main-nav"
          className={`header__nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Navegación principal"
        >
          <ul className="header__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "header__link header__link--active"
                      : "header__link"
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
