import { useRef, useState, type UIEvent } from "react";
import "./ApartmentGallery.css";

interface ApartmentGalleryProps {
  photos: string[];
  name: string;
}

function ApartmentGallery({ photos, name }: ApartmentGalleryProps) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const total = photos.length;

  const handleScroll = (event: UIEvent<HTMLUListElement>): void => {
    const track = event.currentTarget;
    const slide = track.firstElementChild;
    if (!(slide instanceof HTMLElement)) {
      return;
    }
    const step = slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    setCurrent(Math.min(total - 1, Math.round(track.scrollLeft / step)));
  };

  const goTo = (index: number): void => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!track || !(slide instanceof HTMLElement)) {
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      // La tira es el contenedor relativo de cada foto.
      left: slide.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="gallery">
      <ul
        className="gallery__track"
        ref={trackRef}
        onScroll={handleScroll}
        tabIndex={0}
        aria-label={`Fotos de ${name}. Desliza o usa las flechas del teclado.`}
      >
        {photos.map((photo, index) => (
          <li className="gallery__slide" key={photo}>
            <img
              src={photo}
              alt={`${name}, foto ${index + 1} de ${total}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>

      <div className="gallery__controls">
        <p className="gallery__counter" aria-live="polite">
          <strong>{String(current + 1).padStart(2, "0")}</strong>
          <span> / {String(total).padStart(2, "0")}</span>
        </p>
        <div className="gallery__buttons">
          <button
            type="button"
            className="gallery__button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="Foto anterior"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="gallery__button"
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            aria-label="Foto siguiente"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentGallery;
