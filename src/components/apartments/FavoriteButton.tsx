import { useFavorites } from "../../context/FavoriteContext";
import "./FavoriteButton.css";

interface FavoriteButtonProps {
  apartmentId: number;
}

export default function FavoriteButton({ apartmentId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(apartmentId);

  return (
    <button
      className="favorite-button"
      type="button"
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
      onClick={() => toggleFavorite(apartmentId)}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
