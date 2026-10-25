import { useEffect, useState } from "react";
import type { Apartment } from "../types/apartment";
import { isApartment } from "../utils/isApartment";

const DATA_URL = "/data/apartments.json";

export interface UseApartmentsResult {
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useApartments(): UseApartmentsResult {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApartments(): Promise<void> {
      try {
        const response = await fetch(DATA_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Error al cargar apartamentos (${response.status})`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data) || !data.every(isApartment)) {
          throw new Error(
            "El archivo de apartamentos tiene un formato inválido.",
          );
        }

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
    setIsLoading(true);
    setError(null);
    setAttempt((current) => current + 1);
  };

  return { apartments, isLoading, error, retry };
}
