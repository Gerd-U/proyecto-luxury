import { useEffect, useState } from "react";

const STORAGE_KEY = "la-guaria:intro-vista";
const VISIBLE_MS = 1700;
const EXIT_MS = 700;

export interface IntroLoaderState {
  isVisible: boolean;
  isLeaving: boolean;
  skip: () => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function wasSeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function markAsSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // La intro podrá volver a mostrarse si no hay almacenamiento.
  }
}

export function useIntroLoader(): IntroLoaderState {
  const [isVisible, setIsVisible] = useState<boolean>(
    () => !prefersReducedMotion() && !wasSeenThisSession(),
  );
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible || isLeaving) return;

    const timer = window.setTimeout(() => setIsLeaving(true), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [isVisible, isLeaving]);

  useEffect(() => {
    if (!isLeaving) return;

    const timer = window.setTimeout(() => {
      setIsVisible(false);
      markAsSeen();
    }, EXIT_MS);
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
