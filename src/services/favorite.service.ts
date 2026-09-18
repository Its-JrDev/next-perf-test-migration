import api from '@/services/api.client';
import type { Favorite, FavoriteEvent } from '@/types';

export const favoriteService = {
  async getFavorites(): Promise<FavoriteEvent[]> {
    const { data } = await api.get<FavoriteEvent[]>('/favorites');
    return data;
  },

  async addFavorite(eventId: string): Promise<Favorite> {
    const { data } = await api.post<Favorite>(`/favorites/${eventId}`);
    return data;
  },

  async removeFavorite(eventId: string): Promise<void> {
    await api.delete(`/favorites/${eventId}`);
  },
};
