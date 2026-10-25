import type { MouseEvent } from "react";
import { flushSync } from "react-dom";

/** Comprueba que sea un clic normal, no uno para abrir otra pestaña. */
export function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/** Comparte el nombre de transición entre la card y el hero. */
export function getImageTransitionName(apartmentId: number): string {
  return `residencia-${apartmentId}`;
}

/** Comprueba el soporte del navegador y la preferencia de movimiento. */
export function canUseViewTransition(): boolean {
  return (
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Ejecuta el cambio con transición si está disponible. */
export function runViewTransition(update: () => void): void {
  if (!canUseViewTransition()) {
    update();
    return;
  }

  const root = document.documentElement;
  // Evita que el CSS ejecute su animación de respaldo.
  root.dataset.viewTransition = "on";

  const transition = document.startViewTransition(() => {
    // React debe pintar la página antes de que el navegador la capture.
    flushSync(update);
    window.scrollTo(0, 0);
  });

  void transition.finished.finally(() => {
    delete root.dataset.viewTransition;
  });
}
