import { AuthGuard } from '@/components/guards';
import { FavoritesPage } from '@/screens/Favorites';

export default function FavoritesRoute() {
  return (
    <AuthGuard>
      <FavoritesPage />
    </AuthGuard>
  );
}