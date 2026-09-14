import { createContext } from 'react';
import type { FavoriteEvent } from '@/types';

export interface FavoritesContextType {
  favorites: FavoriteEvent[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addFavorite: (eventId: string) => Promise<void>;
  removeFavorite: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (eventId: string) => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);
