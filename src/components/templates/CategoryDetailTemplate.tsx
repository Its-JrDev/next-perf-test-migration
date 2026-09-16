'use client';
import { ArrowLeft, CalendarRange, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Skeleton } from '@/components/atoms';
import { EventCard } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/molecules';
import type { Category, Event } from '@/types';

interface CategoryDetailTemplateProps {
  category: Category | null;
  categoryLoading: boolean;
  categoryError: string | null;
  events: Event[];
  eventsLoading: boolean;
  eventsError: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onBack: () => void;
  onCreateEvent: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
}

export function CategoryDetailTemplate({
  category,
  categoryLoading,
  categoryError,
  events,
  eventsLoading,
  eventsError,
  isAuthenticated,
  isAdmin,
  onBack,
  onCreateEvent,
  onEditCategory,
  onDeleteCategory,
}: CategoryDetailTemplateProps) {
  return (
    <div className="grid gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 justify-self-start"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
        Volver a categorías
      </Button>

      {categoryLoading ? (
        <Skeleton className="h-10 w-2/3" />
      ) : categoryError || !category ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar la categoría</AlertTitle>
          <AlertDescription>
            {categoryError ?? 'No encontrada.'}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAuthenticated && (
              <Button
                onClick={onCreateEvent}
                className="w-full gap-2 sm:w-auto"
              >
                <Plus className="size-4" />
                Agregar evento a esta categoría
              </Button>
            )}
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Editar categoría"
                  onClick={onEditCategory}
                >
                  <Pencil className="size-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      aria-label="Eliminar categoría"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar categoría</DialogTitle>
                      <DialogDescription>
                        ¿Seguro que deseas eliminar “{category.name}”? Los
                        eventos existentes impedirán la eliminación si están
                        asociados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={onDeleteCategory}
                      >
                        Eliminar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      )}

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Eventos</h2>

        {eventsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : eventsError ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudieron cargar los eventos</AlertTitle>
            <AlertDescription>{eventsError}</AlertDescription>
          </Alert>
        ) : events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
            <CalendarRange className="text-muted-foreground size-10" />
            <p className="text-muted-foreground">
              Esta categoría no tiene eventos.
            </p>
            {isAuthenticated && (
              <Button variant="outline" onClick={onCreateEvent}>
                <Plus className="size-4" />
                Agregar evento
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
