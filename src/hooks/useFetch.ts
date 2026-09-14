import { useState, useEffect, useCallback } from 'react';
import type { DependencyList } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export type AsyncFetcher<T> = () => Promise<T>;

/**
 * Hook genérico reutilizable para consumir la API: dispara la petición desde
 * un useEffect y re-carga cuando cambian las dependencias indicadas.
 * Convierte cualquier error (red, validación, autorización) en un mensaje
 * legible para el usuario.
 */
export function useFetch<T>(
  fetcher: AsyncFetcher<T>,
  deps: DependencyList = [],
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String(err.message)
          : 'Ocurrió un error al cargar los datos';
      setState((prev) => ({
        ...prev,
        data: null,
        isLoading: false,
        error: message,
      }));
    }
  }, [fetcher]);

  useEffect(() => {
    // Carga inicial / re-carga por dependencias: el fetching en effects es un
    // caso admitido por React; el flag síncrono de loading es lo que dispara la
    // regla set-state-in-effect, pero no causa renders en cascada aquí.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  const refetch = useCallback(() => load(), [load]);

  return { ...state, refetch };
}
