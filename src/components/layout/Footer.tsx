import { Link } from "react-router-dom";
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

const BRAND_NAME = "Nombre de tu marca";

const NAV_LINKS: FooterLink[] = [
  { label: "Inicio", to: "/" },
  { label: "Apartamentos", to: "/apartamentos" },
  { label: "Favoritos", to: "/favoritos" },
  { label: "Contacto", to: "/contacto" },
];

const CONTACT_ITEMS: ContactItem[] = [
  { label: "Teléfono", value: "+506 2222-0000", href: "tel:+50622220000" },
  { label: "Correo", value: "info@tumarca.com", href: "mailto:info@tumarca.com" },
  { label: "Oficina", value: "Escazú, San José" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { name: "Instagram", url: "https://instagram.com" },
  { name: "Facebook", url: "https://facebook.com" },
  { name: "WhatsApp", url: "https://wa.me/50622220000" },
];

function Footer() {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <section className="footer__brand">
          <h2 className="footer__name">{BRAND_NAME}</h2>
          <p className="footer__text">
            Apartamentos de lujo rodeados de naturaleza, pensados para vivir con
            calma y elegancia.
          </p>
          <Link to="/contacto" className="footer__cta">
            Agendar una visita
          </Link>
        </section>

        <div className="footer__columns">
          <section className="footer__col">
            <h3 className="footer__title">Explorar</h3>
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
            <h3 className="footer__title">Contacto</h3>
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
            <h3 className="footer__title">Síguenos</h3>
            <ul className="footer__list">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    className="footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {currentYear} {BRAND_NAME}. Todos los derechos reservados.</p>
        <p>Proyecto académico, UCR Sede de Occidente</p>
      </div>
    </footer>
  );
}

export default Footer;