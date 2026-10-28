import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import BrandMark from "../brand/BrandMark";
import { useScrolled } from "../../hooks/useScrolled";
import "./Header.css";

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

const DESKTOP_QUERY = "(min-width: 900px)";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();
  const isScrolled = useScrolled(40);

  const isHome = pathname === "/";
  const isOverHero = isHome && !isScrolled && !isMenuOpen;

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  // cierra el menú con escape o al cambiar a escritorio
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleResize = (): void => {
      if (desktop.matches) {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleResize);
    };
  }, [isMenuOpen]);

  const headerClasses = [
    "header",
    isHome ? "header--home" : "",
    isOverHero ? "header--over" : "",
    isMenuOpen ? "header--menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClasses}>
      <div className="header__container">
        <Link
          to="/"
          className="header__brand"
          onClick={closeMenu}
          aria-label="Residencias La Guaria, ir al inicio"
        >
          <BrandMark size={34} className="header__mark" />
          <span className="header__wordmark">
            <span className="header__name">La Guaria</span>
            <span className="header__sub">Residencias</span>
          </span>
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
              <li key={item.to} className="header__item">
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
