import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BrandMark from "../../components/brand/BrandMark";
import ApartmentGallery from "../../components/apartments/ApartmentGallery";
import FavoriteButton from "../../components/apartments/FavoriteButton";
import KeyFacts from "../../components/apartments/KeyFacts";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { useApartments } from "../../hooks/useApartments";
import { useInView } from "../../hooks/useInView";
import type { Apartment } from "../../types/apartment";
import { formatPrice } from "../../utils/formatPrice";
import { getRegion } from "../../utils/region";
import {
  canUseViewTransition,
  getImageTransitionName,
  isPlainLeftClick,
  runViewTransition,
} from "../../utils/viewTransition";
import "./ApartmentDetailPage.css";

interface BackTarget {
  to: string;
  label: string;
}

/** Recupera la página de origen o usa el catálogo como respaldo. */
function getBackTarget(state: unknown): BackTarget {
  if (typeof state === "object" && state !== null && "from" in state) {
    const from = state.from;
    if (typeof from === "string" && from.startsWith("/favoritos")) {
      return { to: from, label: "Favoritos" };
    }
    if (typeof from === "string" && from.startsWith("/apartamentos")) {
      return { to: from, label: "Catálogo" };
    }
  }
  return { to: "/apartamentos", label: "Catálogo" };
}

function getContactPath(apartment: Apartment): string {
  return `/contacto?propiedad=${encodeURIComponent(apartment.name)}`;
}

const REGION_LABEL = { valle: "Valle Central", pacifico: "Pacífico" } as const;

interface ApartmentDetailProps {
  apartment: Apartment;
  catalog: Apartment[];
  next: Apartment;
  back: BackTarget;
}

function ApartmentDetail({ apartment, catalog, next, back }: ApartmentDetailProps) {
  const navigate = useNavigate();
  const { id, name, location, price, image, gallery, description, amenities } = apartment;

  // La barra fija aparece cuando el hero sale de pantalla.
  const [heroRef, isHeroInView] = useInView<HTMLElement>({ initialInView: true });
  const reveal = { once: true, rootMargin: "0px 0px -12% 0px" };
  const [factsRef, factsVisible] = useInView<HTMLElement>(reveal);
  const [storyRef, storyVisible] = useInView<HTMLElement>(reveal);
  const [galleryRef, galleryVisible] = useInView<HTMLElement>(reveal);
  const [amenitiesRef, amenitiesVisible] = useInView<HTMLElement>(reveal);

  // Si no hay galería, muestra la foto principal.
  const photos = gallery && gallery.length > 0 ? gallery : [image];
  const contactPath = getContactPath(apartment);
  const revealClass = (visible: boolean): string => `reveal ${visible ? "is-visible" : ""}`;

  const openNext = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (!isPlainLeftClick(event) || !canUseViewTransition()) {
      return;
    }
    event.preventDefault();
    runViewTransition(() =>
      navigate(`/apartamentos/${next.id}`, { state: { from: back.to } }),
    );
  };

  return (
    <article className="detail">
      <nav className="detail__top" aria-label="Ubicación en el sitio">
        <Link to={back.to} className="detail__back">
          <span aria-hidden="true">←</span> {back.label}
        </Link>
        <p className="detail__crumb">
          {REGION_LABEL[getRegion(location)]} · {location}
        </p>
      </nav>

      <header className="detail-hero" ref={heroRef}>
        <div className="detail-hero__media">
          <img
            src={image}
            alt={`${name}, ${location}`}
            style={{ viewTransitionName: getImageTransitionName(id) }}
          />
        </div>
        <div className="detail-hero__veil" aria-hidden="true" />
        <div className="detail-hero__content">
          <p className="detail-hero__location">{location}</p>
          <h1 className="detail-hero__title">{name}</h1>
          <div className="detail-hero__actions">
            <Link to={contactPath} className="detail__cta">
              Solicitar visita
            </Link>
            <FavoriteButton apartmentId={id} apartmentName={name} tone="dark" />
          </div>
        </div>
      </header>

      <section
        className={`detail__section ${revealClass(factsVisible)}`}
        ref={factsRef}
        aria-labelledby="detalle-ficha"
      >
        <h2 id="detalle-ficha" className="detail__heading">
          La ficha
        </h2>
        <KeyFacts apartment={apartment} catalog={catalog} isVisible={factsVisible} />
      </section>

      <section
        className={`detail__section detail__story ${revealClass(storyVisible)}`}
        ref={storyRef}
        aria-labelledby="detalle-residencia"
      >
        <h2 id="detalle-residencia" className="detail__heading">
          La residencia
        </h2>
        <p className="detail__description">{description}</p>
      </section>

      <section
        className={`detail__section ${revealClass(galleryVisible)}`}
        ref={galleryRef}
        aria-labelledby="detalle-recorrido"
      >
        <h2 id="detalle-recorrido" className="detail__heading">
          Recorrido
        </h2>
        <ApartmentGallery photos={photos} name={name} />
      </section>

      <section
        className={`detail__amenities ${revealClass(amenitiesVisible)}`}
        ref={amenitiesRef}
        aria-labelledby="detalle-incluye"
      >
        <div className="detail__amenities-inner">
          <h2 id="detalle-incluye" className="detail__heading">
            Lo que incluye
          </h2>
          <ul className="detail__amenity-list">
            {amenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="detail__closing" aria-labelledby="detalle-cierre">
        <div className="detail__closing-text">
          <h2 id="detalle-cierre" className="detail__closing-title">
            ¿Te imaginas viviendo aquí?
          </h2>
          <p>
            Agenda una visita privada a {name}. Te acompañamos desde el primer
            recorrido hasta la firma.
          </p>
          <div className="detail__closing-actions">
            <Link to={contactPath} className="detail__cta">
              Solicitar visita
            </Link>
            <FavoriteButton apartmentId={id} apartmentName={name} />
            <Link to={back.to} className="detail__text-link">
              Volver a {back.label === "Catálogo" ? "el catálogo" : "favoritos"}
            </Link>
          </div>
        </div>

        <Link
          to={`/apartamentos/${next.id}`}
          state={{ from: back.to }}
          className="detail__next"
          onClick={openNext}
        >
          <img
            src={next.image}
            alt=""
            loading="lazy"
            style={{ viewTransitionName: getImageTransitionName(next.id) }}
          />
          <span className="detail__next-label">Siguiente residencia</span>
          <span className="detail__next-name">
            {next.name} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>

      <div className={`detail__bar ${isHeroInView ? "" : "is-visible"}`} inert={isHeroInView}>
        <div className="detail__bar-text">
          <span className="detail__bar-name">{name}</span>
          <span className="detail__bar-price">{formatPrice(price)}</span>
        </div>
        <Link to={contactPath} className="detail__cta detail__cta--small">
          Solicitar visita
        </Link>
      </div>
    </article>
  );
}

function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { apartments, isLoading, error, retry } = useApartments();
  const back = getBackTarget(location.state);

  const apartmentId = Number(id);
  const index = Number.isSafeInteger(apartmentId)
    ? apartments.findIndex((item) => item.id === apartmentId)
    : -1;

  if (isLoading) {
    return (
      <div className="detail detail--state" role="status">
        <span className="sr-only">Cargando la residencia…</span>
        <div className="detail-skeleton" aria-hidden="true">
          <span className="detail-skeleton__line" />
          <div className="detail-skeleton__hero" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail detail--state">
        <ErrorMessage message={error} onRetry={retry} />
        <Link to={back.to} className="detail__text-link">
          Volver a {back.label === "Catálogo" ? "el catálogo" : "favoritos"}
        </Link>
      </div>
    );
  }

  if (index === -1) {
    return (
      <div className="detail detail--state">
        <EmptyState
          icon={<BrandMark size={72} />}
          title="No encontramos esta residencia"
          message="El enlace puede estar incompleto o la residencia ya no está en el catálogo."
          action={
            <Link to="/apartamentos" className="detail__cta">
              Ver todas las residencias
            </Link>
          }
        />
      </div>
    );
  }

  const apartment = apartments[index];
  const next = apartments[(index + 1) % apartments.length];

  // Cambiar de residencia reinicia las secciones y la galería.
  return (
    <ApartmentDetail
      key={apartment.id}
      apartment={apartment}
      catalog={apartments}
      next={next}
      back={back}
    />
  );
}

export default ApartmentDetailPage;
