import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import type { Apartment } from "../../types/apartment";
import { formatPrice } from "../../utils/formatPrice";
import FavoriteButton from "../../components/apartments/FavoriteButton";
import "./ApartmentDetailPage.css";

function isApartment(value: unknown): value is Apartment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "location" in value &&
    typeof value.location === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "image" in value &&
    typeof value.image === "string" &&
    "description" in value &&
    typeof value.description === "string" &&
    "bedrooms" in value &&
    typeof value.bedrooms === "number" &&
    "bathrooms" in value &&
    typeof value.bathrooms === "number" &&
    "area" in value &&
    typeof value.area === "number" &&
    "amenities" in value &&
    Array.isArray(value.amenities) &&
    value.amenities.every((amenity) => typeof amenity === "string") &&
    (!("featured" in value) || typeof value.featured === "boolean")
  );
}

function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApartment() {
      setIsLoading(true);
      setError(null);
      setApartment(null);

      try {
        const response = await fetch("/data/apartments.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Error al cargar apartamentos (${response.status})`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isApartment)) {
          throw new Error(
            "El archivo de apartamentos tiene un formato inválido.",
          );
        }

        const apartmentId = Number(id);
        setApartment(
          Number.isSafeInteger(apartmentId)
            ? (data.find((item) => item.id === apartmentId) ?? null)
            : null,
        );
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la información del apartamento.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadApartment();
    return () => controller.abort();
  }, [id]);

  return (
    <main className="apartment-detail-page">
      <section className="apartment-detail-header">
        <Link to="/apartamentos" className="back-link">
          ← Volver al catalogo
        </Link>
      </section>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : apartment ? (
        <>
          <header className="apartment-detail-header">
            <h1>{apartment.name}</h1>
            <p>{apartment.location}</p>
          </header>

          <section className="apartment-detail-content">
            <div className="apartment-detail-gallery">
              <img src={apartment.image} alt={`Fachada de ${apartment.name}`} />
            </div>

            <div className="apartment-detail-info">
              <h2>Información de la propiedad</h2>
              <p className="apartment-detail-price">
                {formatPrice(apartment.price)} <span>/ mes</span>
              </p>
              <p>{apartment.description}</p>

              <div className="apartment-detail-features">
                <div>
                  <strong>{apartment.bedrooms}</strong>
                  <span>Habitaciones</span>
                </div>
                <div>
                  <strong>{apartment.bathrooms}</strong>
                  <span>Baños</span>
                </div>
                <div>
                  <strong>{apartment.area} m²</strong>
                  <span>Área</span>
                </div>
              </div>

              <h3>Servicios y amenidades</h3>
              <ul className="apartment-detail-amenities">
                {apartment.amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>

              <div className="apartment-detail-actions">
                <FavoriteButton apartmentId={apartment.id} />
                <Link
                  to={`/contacto?propiedad=${encodeURIComponent(apartment.name)}`}
                  className="apartment-contact-button"
                >
                  Solicitar información
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="Apartamento no encontrado"
          message="No encontramos una propiedad con ese identificador."
          action={<Link to="/apartamentos">Volver al catálogo</Link>}
        />
      )}
    </main>
  );
}

export default ApartmentDetailPage;
