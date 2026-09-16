'use client';
import { CalendarRange, Plus, Search } from 'lucide-react';
import { Button, Input, Skeleton } from '@/components/atoms';
import { EventCard, PaginationWithSize } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules';
import type { Category, Event } from '@/types';

interface EventsTemplateProps {
  title: string;
  subtitle: string;
  events: Event[];
  categories: Category[];
  search: string;
  categoryId?: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId?: string) => void;
  isLoading: boolean;
  error: string | null;
  canCreate: boolean;
  onCreate: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function EventsTemplate({
  title,
  subtitle,
  events,
  categories,
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
  isLoading,
  error,
  canCreate,
  onCreate,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: EventsTemplateProps) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {canCreate && (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Nuevo evento
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre o descripción…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryId ?? 'all'}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : !error && events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <CalendarRange className="text-muted-foreground size-10" />
          <p className="text-muted-foreground">
            {search || categoryId
              ? 'No hay eventos que coincidan con la búsqueda.'
              : 'Todavía no hay eventos.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <PaginationWithSize
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
