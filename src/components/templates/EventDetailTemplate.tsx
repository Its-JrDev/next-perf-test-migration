import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge, Button, EventImage, Skeleton } from '@/components/atoms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FavoriteButton,
} from '@/components/molecules';
import { formatPrice } from '@/utils';
import type { Event as EventType } from '@/types';

interface EventDetailTemplateProps {
  event: EventType | null;
  isLoading: boolean;
  error: string | null;
  canEdit: boolean;
  deleting: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetailTemplate({
  event,
  isLoading,
  error,
  canEdit,
  deleting,
  onBack,
  onEdit,
  onDelete,
}: EventDetailTemplateProps) {
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const images = useMemo(
    () => [...(event?.images ?? [])].sort((a, b) => a.order - b.order),
    [event?.images],
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No se pudo cargar el evento</AlertTitle>
        <AlertDescription>{error ?? 'Evento no encontrado.'}</AlertDescription>
      </Alert>
    );
  }

  const activeImageIndex = Math.max(
    0,
    images.findIndex((image) => image.id === activeImageId),
  );
  const activeImage = images[activeImageIndex];

  return (
    <div className="grid gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 justify-self-start"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
        Volver
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative">
          <EventImage
            src={activeImage?.url}
            alt={event.name}
            className="aspect-square w-full rounded-xl"
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton eventId={event.id} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary">{event.category?.name}</Badge>
            {canEdit && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={onEdit}
                >
                  <Pencil className="size-4" />
                  Editar
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="size-4" />
                      Eliminar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar evento</DialogTitle>
                      <DialogDescription>
                        ¿Seguro que deseas eliminar “{event.name}”? Esta acción
                        no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        disabled={deleting}
                        onClick={onDelete}
                      >
                        {deleting ? 'Eliminando…' : 'Eliminar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-primary text-3xl font-bold">
            {formatPrice(event.price)}
          </p>

          <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Fecha
              </p>
              <p className="mt-1 font-medium">
                {new Intl.DateTimeFormat('es-ES', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }).format(new Date(event.date))}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Lugar
              </p>
              <p className="mt-1 font-medium">{event.location}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Capacidad
              </p>
              <p className="mt-1 font-medium">
                {event.capacity > 0 ? `${event.capacity} plazas` : 'Sin capacidad'}
              </p>
            </div>
          </div>

          {event.description && (
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          )}

          {images.length > 1 && (
            <div>
              <p className="mb-2 text-sm font-medium">Galería</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    aria-label={`Ver imagen ${index + 1} de ${event.name}`}
                    aria-pressed={index === activeImageIndex}
                    onClick={() => setActiveImageId(img.id)}
                    className={
                      index === activeImageIndex
                        ? 'ring-primary shrink-0 rounded-lg ring-2 ring-offset-2'
                        : 'shrink-0 rounded-lg opacity-70 transition-opacity hover:opacity-100'
                    }
                  >
                    <EventImage
                      src={img.url}
                      alt={`${event.name} ${img.order}`}
                      className="size-24 rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
