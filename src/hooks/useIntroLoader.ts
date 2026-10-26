import { useEffect, useState } from "react";

const VISIBLE_MS = 3000;
const EXIT_MS = 700;

export interface IntroLoaderState {
  isVisible: boolean;
  isLeaving: boolean;
  skip: () => void;
}

// Se reinicia con cada recarga: así la intro sale cada vez que se carga Inicio,
// pero no al volver a Inicio navegando dentro de la app.
let hasPlayedThisLoad = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// La intro solo se muestra si la página se cargó (o recargó) en Inicio ("/").
function pageLoadedAtHome(): boolean {
  const [entry] = performance.getEntriesByType("navigation");
  return !entry || new URL(entry.name).pathname === "/";
}

export function useIntroLoader(): IntroLoaderState {
  const [isVisible, setIsVisible] = useState<boolean>(
    () => !prefersReducedMotion() && !hasPlayedThisLoad && pageLoadedAtHome(),
  );
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    hasPlayedThisLoad = true;
  }, []);

  useEffect(() => {
    if (!isVisible || isLeaving) return;

    const timer = window.setTimeout(() => setIsLeaving(true), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [isVisible, isLeaving]);

  useEffect(() => {
    if (!isLeaving) return;

    const timer = window.setTimeout(() => setIsVisible(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [isLeaving]);

  useEffect(() => {
    if (!isVisible) return;

    const root = document.documentElement;
    root.style.overflow = "hidden";

    const handleKeyDown = (): void => setIsLeaving(true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  const skip = (): void => setIsLeaving(true);

  return { isVisible, isLeaving, skip };
}
