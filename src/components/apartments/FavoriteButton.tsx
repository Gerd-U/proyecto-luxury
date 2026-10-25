import { useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";
import "./FavoriteButton.css";

interface FavoriteButtonProps {
  apartmentId: number;
  apartmentName?: string;
  tone?: "light" | "dark";
  onToggle?: (isNowFavorite: boolean) => void;
}

export default function FavoriteButton({
  apartmentId,
  apartmentName,
  tone = "light",
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(apartmentId);
  // Activa el pulso después del clic.
  const [justToggled, setJustToggled] = useState<boolean>(false);

  const target = apartmentName ?? "esta residencia";
  const label = active
    ? `Quitar ${target} de favoritos`
    : `Guardar ${target} en favoritos`;

  const handleClick = (): void => {
    toggleFavorite(apartmentId);
    setJustToggled(true);
    onToggle?.(!active);
  };

  return (
    <button
      className={[
        "favorite-button",
        `favorite-button--${tone}`,
        justToggled ? "favorite-button--pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={handleClick}
      onAnimationEnd={() => setJustToggled(false)}
    >
      <svg
        className="favorite-button__icon"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 20.5s-7.5-4.6-9.3-9.3C1.4 7.8 3.7 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.4 0 5.7 3.3 4.4 6.7-1.8 4.7-9.3 9.3-9.3 9.3Z" />
      </svg>
    </button>
  );
}
