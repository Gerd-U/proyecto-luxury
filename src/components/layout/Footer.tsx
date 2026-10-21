import { Link } from "react-router-dom";

//CSS COMENTADO POR QUE TODAVIA NO ESTA CREADO
//import './Footer.css';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

interface SocialLink {
  name: string;
  url: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  { label: "Teléfono", value: "+506 2222-0000", href: "tel:+50622220000" },
  {
    label: "Correo",
    value: "info@tumarca.com",
    href: "mailto:info@tumarca.com",
  },
  { label: "Oficina", value: "Escazú, San José, Costa Rica" },
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
        <section className="footer__col">
          <h2 className="footer__title">Nombre de tu marca</h2>
          <p className="footer__text">
            Una frase corta de la empresa, la misma idea de tu propuesta de
            valor.
          </p>
          <Link to="/contacto" className="footer__cta">
            Agendar una visita
          </Link>
        </section>

        <section className="footer__col">
          <h2 className="footer__title">Contacto</h2>
          <ul className="footer__list">
            {CONTACT_ITEMS.map((item) => (
              <li key={item.label}>
                <span className="footer__label">{item.label}: </span>
                {item.href ? (
                  <a href={item.href} className="footer__link">
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
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
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="footer__bottom">
        <p>
          © {currentYear} Nombre de tu marca. Todos los derechos reservados.
        </p>
        <p className="footer__note">
          Proyecto académico, UCR Sede de Occidente.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
