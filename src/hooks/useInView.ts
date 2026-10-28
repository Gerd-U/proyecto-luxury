import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInViewOptions {
  once?: boolean;
  rootMargin?: string;
  initialInView?: boolean;
}

export function useInView<T extends HTMLElement>({
  once = false,
  rootMargin = "0px",
  initialInView = false,
}: UseInViewOptions = {}): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  // sin observer, trata el elemento como visible
  const [isInView, setIsInView] = useState<boolean>(
    () => typeof IntersectionObserver === "undefined" || initialInView,
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return [ref, isInView];
}
