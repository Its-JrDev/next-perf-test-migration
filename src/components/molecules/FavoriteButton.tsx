'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth, useFavorites } from '@/hooks';
import { Button } from '@/components/atoms';
import { isApiError } from '@/services/errors';
import { cn } from '@/utils/cn';

interface FavoriteButtonProps {
  eventId: string;
  className?: string;
}

export function FavoriteButton({ eventId, className }: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();

  const active = isFavorite(eventId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    try {
      await toggleFavorite(eventId);
      toast.success(active ? 'Quitado de favoritos' : 'Agregado a favoritos');
    } catch (err) {
      if (isApiError(err)) {
        // 409: ya estaba en favoritos; 404: no estaba. La interfaz no se rompe.
        if (err.status === 409 || err.status === 404) {
          toast.info(err.message);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('No se pudo actualizar el favorito');
      }
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isLoading && isAuthenticated}
      onClick={handleClick}
      className={cn('rounded-full', className)}
      aria-label={
        !isAuthenticated
          ? 'Inicia sesión para guardar favoritos'
          : active
            ? 'Quitar de favoritos'
            : 'Agregar a favoritos'
      }
    >
      <Heart
        className={cn(
          'size-5 transition-colors',
          !isAuthenticated
            ? 'text-muted-foreground'
            : active
              ? 'fill-current text-red-500'
              : 'text-muted-foreground',
        )}
      />
    </Button>
  );
}
