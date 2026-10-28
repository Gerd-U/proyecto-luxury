import { useEffect, useState } from "react";
import type { Apartment } from "../types/apartment";
import { isApartment } from "../utils/isApartment";

const DATA_URL = "/data/apartments.json";

// reutiliza el catálogo entre páginas
let cachedApartments: Apartment[] | null = null;

export interface UseApartmentsResult {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useApartments(): UseApartmentsResult {
  const [apartments, setApartments] = useState<Apartment[]>(
    () => cachedApartments ?? [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    () => cachedApartments === null,
  );
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    if (cachedApartments !== null && attempt === 0) {
      return;
    }

    // cancela la petición al desmontar
    const controller = new AbortController();

    async function loadApartments(): Promise<void> {
      try {
        const response = await fetch(DATA_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`No pudimos cargar el catálogo (error ${response.status}).`);
        }

        const data: unknown = await response.json().catch(() => {
          throw new Error("No pudimos leer el catálogo. Intenta de nuevo en un momento.");
        });
        if (!Array.isArray(data) || !data.every(isApartment)) {
          throw new Error("El catálogo tiene datos incompletos o con un formato inválido.");
        }

        cachedApartments = data;
        setApartments(data);
        setError(null);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los apartamentos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadApartments();
    return () => controller.abort();
  }, [attempt]);

  const retry = (): void => {
    cachedApartments = null;
    setIsLoading(true);
    setError(null);
    setAttempt((current) => current + 1);
  };

  return { apartments, isLoading, error, retry };
}
