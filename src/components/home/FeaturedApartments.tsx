import { useEffect, useState } from "react";
import FavoriteButton from "../apartments/FavoriteButton";
import ApartmentList from "../apartments/ApartmentList";
import type { Apartment } from "../../types/apartment";
import "./FeaturedApartments.css";

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

function useApartments(): Apartment[] {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApartments() {
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

        setApartments(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(
            "No se pudieron cargar los apartamentos destacados.",
            error,
          );
        }
      }
    }

    void loadApartments();
    return () => controller.abort();
  }, []);

  return apartments;
}

function FeaturedApartments() {
  const apartments = useApartments();
  const featuredApartments = apartments
    .filter((apartment) => apartment.featured === true)
    .slice(0, 3);

  return (
    <section className="featured-section">
      <h2 className="featured-title">Apartamentos destacados</h2>
      <p className="featured-description">
        Descubre nuestra selección de propiedades diseñadas para ti.
      </p>

      <div className="featured-container">
        <ApartmentList
          apartments={featuredApartments}
          renderActions={(apartment) => (
            <FavoriteButton apartmentId={apartment.id} />
          )}
        />
      </div>
    </section>
  );
}

export default FeaturedApartments;
