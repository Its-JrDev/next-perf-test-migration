'use client';

import { useAuth, useFavorites } from '@/hooks';
import { FavoritesTemplate } from '@/components/templates';

export function FavoritesPage() {
  const { favorites, isLoading, error } = useFavorites();
  const { isAuthenticated } = useAuth();

  return (
    <FavoritesTemplate
      favorites={favorites}
      isLoading={isLoading}
      error={error}
      isAuthenticated={isAuthenticated}
    />
  );
}
