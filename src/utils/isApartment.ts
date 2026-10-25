import type { Apartment } from "../types/apartment";

export function isApartment(value: unknown): value is Apartment {
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
