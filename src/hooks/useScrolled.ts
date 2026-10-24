import { useEffect, useState } from "react";

/**
 * Devuelve true cuando la página bajó más de `threshold` píxeles.
 * Lo usa el header para pasar de transparente a sólido.
 */
export function useScrolled(threshold: number = 24): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => window.scrollY > threshold,
  );

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    // passive: le avisa al navegador que no vamos a bloquear el scroll.
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
