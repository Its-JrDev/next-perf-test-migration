import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useAuth } from '@/hooks';
import { favoriteService, toApiError } from '@/services';
import { FavoritesContext } from '@/contexts';
import type { FavoriteEvent } from '@/types';

const getFavoriteEventId = (favorite: FavoriteEvent & { eventId?: string }) =>
  favorite.eventId ?? favorite.id;

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await favoriteService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Carga los favoritos al montarse o al cambiar la sesión. Fetching en
    // effect admitido por React; el reset síncrono (vacio listado, loading) es
    // lo que detecta la regla y es intencional aquí.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (eventId: string) => {
      await favoriteService.addFavorite(eventId);
      await fetchFavorites();
    },
    [fetchFavorites],
  );

  const removeFavorite = useCallback(
    async (eventId: string) => {
      await favoriteService.removeFavorite(eventId);
      await fetchFavorites();
    },
    [fetchFavorites],
  );

  const favoriteIds = useMemo(
    () =>
      new Set(
        favorites.map((favorite) =>
          getFavoriteEventId(favorite as FavoriteEvent & { eventId?: string }),
        ),
      ),
    [favorites],
  );

  const isFavorite = useCallback(
    (eventId: string) => favoriteIds.has(eventId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (eventId: string) => {
      if (isFavorite(eventId)) {
        await removeFavorite(eventId);
      } else {
        await addFavorite(eventId);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isLoading,
        error,
        refetch: fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
