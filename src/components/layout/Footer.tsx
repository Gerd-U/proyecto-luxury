import { Link, NavLink } from "react-router-dom";
import BrandMark from "../brand/BrandMark";
import SocialIcon from "../ui/SocialIcon";
import type { FooterLink, SocialLink } from "../../types/footer";
import "./Footer.css";

const BRAND_NAME = "Residencias La Guaria";

const NAV_LINKS: FooterLink[] = [
  { label: "Inicio", to: "/" },
  { label: "Apartamentos", to: "/apartamentos" },
  { label: "Favoritos", to: "/favoritos" },
  { label: "Contacto", to: "/contacto" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { network: "instagram", label: "Instagram", href: "https://instagram.com" },
  { network: "facebook", label: "Facebook", href: "https://facebook.com" },
  { network: "whatsapp", label: "WhatsApp", href: "https://wa.me/50622220000" },
  { network: "email", label: "Correo", href: "mailto:hola@laguaria.cr" },
];

function Footer() {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <Link to="/" className="footer__brand" aria-label={`${BRAND_NAME}, ir al inicio`}>
          <BrandMark size={44} className="footer__mark" />
          <span className="footer__name">{BRAND_NAME}</span>
          <span className="footer__rule" aria-hidden="true" />
        </Link>

        <nav className="footer__nav" aria-label="Enlaces del pie de página">
          <ul className="footer__links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    isActive ? "footer__link footer__link--active" : "footer__link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="footer__social" aria-label="Redes sociales">
          {SOCIAL_LINKS.map((social) => {
            const isEmail = social.network === "email";
            return (
              <li key={social.network}>
                <a
                  href={social.href}
                  className="footer__social-link"
                  aria-label={
                    isEmail
                      ? `Escribir un ${social.label.toLowerCase()}`
                      : `${social.label} (se abre en una pestaña nueva)`
                  }
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                >
                  <SocialIcon network={social.network} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="footer__bottom">
        <p>
          © {currentYear} {BRAND_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
