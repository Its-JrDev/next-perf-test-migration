import { useState } from 'react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks';
import { eventService, isApiError } from '@/services';
import { Button, Input, Textarea } from '@/components/atoms';
import {
  Alert,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules';
import type { CreateEventPayload, Event } from '@/types';

interface EventFormProps {
  mode: 'create' | 'edit';
  event?: Event;
  defaultCategoryId?: string;
  categoryLocked?: boolean;
  onSaved?: (event: Event) => void;
  onCancel?: () => void;
}

export function EventForm({
  mode,
  event,
  defaultCategoryId,
  categoryLocked = false,
  onSaved,
  onCancel,
}: EventFormProps) {
  const { categories, isLoading: catsLoading } = useCategories();

  const [name, setName] = useState(event?.name ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [date, setDate] = useState(event?.date ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [price, setPrice] = useState(event ? String(event.price) : '');
  const [capacity, setCapacity] = useState(event ? String(event.capacity) : '');
  const [categoryId, setCategoryId] = useState<string>(
    event?.categoryId ?? defaultCategoryId ?? '',
  );
  const [images, setImages] = useState(
    event?.images?.map((img) => img.url).join('\n') ?? '',
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveCategoryValue = (value: string) => {
    if (categoryLocked) return defaultCategoryId ?? '';
    return value === 'none' ? '' : value;
  };

  const imagesList = images
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio';
    if (!date.trim()) next.date = 'La fecha es obligatoria';
    if (!location.trim()) next.location = 'La ubicación es obligatoria';
    const parsedPrice = Number(price);
    if (price.trim() === '' || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      next.price = 'Ingresá un precio mayor a 0';
    }
    const parsedCapacity = Number(capacity);
    if (
      capacity.trim() === '' ||
      Number.isNaN(parsedCapacity) ||
      parsedCapacity < 0
    ) {
      next.capacity = 'Ingresá una capacidad mayor o igual a 0';
    }
    if (!categoryLocked && !categoryId) {
      next.categoryId = 'Seleccioná una categoría';
    }
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload: CreateEventPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      date: date.trim(),
      location: location.trim(),
      price: parsedPrice,
      capacity: parsedCapacity,
      categoryId: categoryLocked ? (defaultCategoryId as string) : categoryId,
      images: imagesList,
    };

    setIsSubmitting(true);
    try {
      const saved =
        mode === 'edit' && event
          ? await eventService.updateEvent(event.id, payload)
          : await eventService.createEvent(payload);
      toast.success(mode === 'edit' ? 'Evento actualizado' : 'Evento creado');
      onSaved?.(saved);
    } catch (err) {
      if (isApiError(err)) {
        if (err.details && err.details.some((d) => d.field)) {
          const byField: Record<string, string> = {};
          if (err.details) {
            for (const d of err.details) {
              if (d.field) byField[d.field] = d.message;
            }
          }
          setFieldErrors(byField);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('No se pudo guardar el evento');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {formError && <Alert variant="destructive">{formError}</Alert>}

      <Field>
        <FieldLabel htmlFor="event-name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="event-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del evento"
          />
          <FieldError>{fieldErrors.name}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="event-description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del evento (opcional)"
            rows={3}
          />
        </FieldContent>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="event-date">Fecha</FieldLabel>
          <FieldContent>
            <Input
              id="event-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <FieldError>{fieldErrors.date}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="event-location">Ubicación</FieldLabel>
          <FieldContent>
            <Input
              id="event-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lugar del evento"
            />
            <FieldError>{fieldErrors.location}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="event-price">Precio</FieldLabel>
          <FieldContent>
            <Input
              id="event-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
            <FieldError>{fieldErrors.price}</FieldError>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="event-capacity">Capacidad</FieldLabel>
          <FieldContent>
            <Input
              id="event-capacity"
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="0"
            />
            <FieldError>{fieldErrors.capacity}</FieldError>
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Categoría</FieldLabel>
        <FieldContent>
          {categoryLocked && defaultCategoryId ? (
            <Input
              value={
                categories.find((c) => c.id === defaultCategoryId)?.name ??
                'Categoría'
              }
              disabled
            />
          ) : (
            <>
              <Select
                value={categoryId || 'none'}
                onValueChange={(v) => setCategoryId(resolveCategoryValue(v))}
                disabled={catsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                El evento se creará dentro de esta categoría.
              </FieldDescription>
              <FieldError>{fieldErrors.categoryId}</FieldError>
            </>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="event-images">Imágenes (URLs)</FieldLabel>
        <FieldContent>
          <Textarea
            id="event-images"
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder={
              'https://ejemplo.com/imagen.jpg\nhttps://ejemplo.com/otra.jpg'
            }
            rows={3}
          />
          <FieldDescription>
            Una URL de imagen por línea. La primera se usa como portada.
          </FieldDescription>
        </FieldContent>
      </Field>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando…'
            : mode === 'edit'
              ? 'Guardar cambios'
              : 'Crear evento'}
        </Button>
      </div>
    </form>
  );
}
