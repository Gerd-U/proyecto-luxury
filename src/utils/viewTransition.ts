import type { MouseEvent } from "react";
import { flushSync } from "react-dom";

export function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function getImageTransitionName(apartmentId: number): string {
  return `residencia-${apartmentId}`;
}

export function canUseViewTransition(): boolean {
  return (
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function runViewTransition(update: () => void): void {
  if (!canUseViewTransition()) {
    update();
    return;
  }

  const root = document.documentElement;
  // evita la animación css de respaldo
  root.dataset.viewTransition = "on";

  const transition = document.startViewTransition(() => {
    // react debe pintar antes de capturar la vista
    flushSync(update);
    window.scrollTo(0, 0);
  });

  void transition.finished.finally(() => {
    delete root.dataset.viewTransition;
  });
}
