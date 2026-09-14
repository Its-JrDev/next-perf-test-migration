import { useState, useEffect, useCallback } from 'react';
import { eventService } from '@/services';
import { toApiError } from '@/services/errors';
import type { Event, PaginatedResponse } from '@/types';

const DEFAULT_LIMIT = 9;

export function useEventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [paginated, setPaginated] = useState<PaginatedResponse<Event>>({
    data: [],
    total: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 0,
  });

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await eventService.getEvents({
        search: search.trim() || undefined,
        categoryId,
      });
      const total = result.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const currentPage = Math.min(page, totalPages);
      const start = (currentPage - 1) * limit;

      setEvents(result.slice(start, start + limit));
      setPaginated({
        data: result.slice(start, start + limit),
        total,
        page: currentPage,
        limit,
        totalPages,
      });
    } catch (err) {
      setError(toApiError(err).message);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, categoryId]);

  useEffect(() => {
    // Carga inicial y re-carga al cambiar búsqueda/categoría/página. Caso
    // legítimo de fetching en effect (ver react.dev/learn/synchronizing-with-effects).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const setSearchAndReset = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const setCategoryAndReset = useCallback((value?: string) => {
    setCategoryId(value);
    setPage(1);
  }, []);

  const setLimitAndReset = useCallback((value: number) => {
    setLimit(value);
    setPage(1);
  }, []);

  const goToPage = useCallback((next: number) => {
    setPage(Math.max(1, next));
  }, []);

  return {
    events,
    paginated,
    isLoading,
    error,
    search,
    categoryId,
    page,
    limit,
    setSearch: setSearchAndReset,
    setCategory: setCategoryAndReset,
    setLimit: setLimitAndReset,
    goToPage,
    refetch: load,
  };
}
