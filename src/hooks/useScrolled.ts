import { useEffect, useState } from "react";

export function useScrolled(threshold: number = 24): boolean {
  const [isScrolled, setIsScrolled] = useState<boolean>(
    () => window.scrollY > threshold,
  );

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
