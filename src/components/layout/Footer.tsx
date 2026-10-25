import { Link } from "react-router-dom";
import BrandMark from "../brand/BrandMark";
import "./Footer.css";

interface FooterLink {
  label: string;
  to: string;
}

interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

interface SocialLink {
  name: string;
  url: string;
}

const BRAND_NAME = "Residencias La Guaria";

const NAV_LINKS: FooterLink[] = [
  { label: "Inicio", to: "/" },
  { label: "Apartamentos", to: "/apartamentos" },
  { label: "Favoritos", to: "/favoritos" },
  { label: "Contacto", to: "/contacto" },
];

const CONTACT_ITEMS: ContactItem[] = [
  { label: "Teléfono", value: "+506 2222-0000", href: "tel:+50622220000" },
  { label: "Correo", value: "hola@laguaria.cr", href: "mailto:hola@laguaria.cr" },
  { label: "Oficina", value: "Escazú, San José" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { name: "Instagram", url: "https://instagram.com" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "WhatsApp", url: "https://wa.me/50622220000" },
];

const PHOTO_CREDITS: string[] = [
  "Meg von Haartman",
  "Polina Kuzovkova",
  "Rosemary Media",
  "You Le",
];

function Footer() {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__cta">
        <p className="footer__cta-text">¿Quieres conocer una residencia en persona?</p>
        <Link to="/contacto" className="footer__cta-button">
          Agendar una visita
        </Link>
      </div>

      <div className="footer__container">
        <section className="footer__brand" aria-label={BRAND_NAME}>
          <BrandMark size={44} className="footer__mark" />
          <p className="footer__text">
            Residencias de lujo en el Valle Central y el Pacífico de Costa
            Rica, elegidas y atendidas de cerca.
          </p>
        </section>

        <div className="footer__columns">
          <section className="footer__col">
            <h2 className="footer__title">Explorar</h2>
            <ul className="footer__list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer__col">
            <h2 className="footer__title">Contacto</h2>
            <ul className="footer__list">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label}>
                  <span className="footer__label">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className="footer__link">
                      {item.value}
                    </a>
                  ) : (
                    <span className="footer__value">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="footer__col">
            <h2 className="footer__title">Síguenos</h2>
            <ul className="footer__list">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    className="footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} (se abre en otra pestaña)`}
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* El nombre a todo el ancho cierra la página, como una firma. */}
      <p className="footer__signature" aria-hidden="true">
        La Guaria
      </p>

      <div className="footer__bottom">
        <p>© {currentYear} {BRAND_NAME}. Proyecto académico, UCR Sede de Occidente.</p>
        <p>
          Fotos: {PHOTO_CREDITS.join(", ")} en{" "}
          <a
            href="https://unsplash.com"
            className="footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;
