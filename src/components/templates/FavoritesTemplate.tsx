import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button, Skeleton } from '@/components/atoms';
import { Alert, AlertDescription, AlertTitle } from '@/components/molecules';
import { EventCard } from '@/components/organisms';
import type { Event } from '@/types';

interface FavoritesTemplateProps {
  favorites: Event[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export function FavoritesTemplate({
  favorites,
  isLoading,
  error,
  isAuthenticated,
}: FavoritesTemplateProps) {
  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertTitle>Sesión requerida</AlertTitle>
        <AlertDescription>
          Inicia sesión para ver tus eventos favoritos.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">Mis favoritos</h1>
        <p className="text-muted-foreground">
          {favorites.length
            ? `Tienes ${favorites.length} evento${
                favorites.length === 1 ? '' : 's'
              } guardado${favorites.length === 1 ? '' : 's'}.`
            : 'Los eventos que guardes aparecerán aquí.'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar favoritos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : !error && favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Heart className="text-muted-foreground size-10" />
          <p className="text-muted-foreground">
            Todavía no tienes eventos favoritos.
          </p>
          <Button variant="outline" asChild>
            <Link href="/events">Explorar eventos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
