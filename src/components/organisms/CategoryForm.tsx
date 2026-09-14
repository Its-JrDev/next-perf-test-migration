import { useState } from 'react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks';
import { toApiError } from '@/services';
import { Button, Input, Textarea } from '@/components/atoms';
import {
  Alert,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/molecules';
import type { Category } from '@/types';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  category?: Category;
  onSaved?: (category: Category) => void;
  onCancel?: () => void;
}

export function CategoryForm({
  mode,
  category,
  onSaved,
  onCancel,
}: CategoryFormProps) {
  const { createCategory, updateCategory } = useCategories();

  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      let saved: Category;
      if (mode === 'edit' && category) {
        saved = await updateCategory(category.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
        toast.success('Categoría actualizada');
      } else {
        saved = await createCategory({
          name: name.trim(),
          description: description.trim() || undefined,
        });
        toast.success('Categoría creada');
      }
      onSaved?.(saved);
    } catch (err) {
      const apiError = toApiError(err);
      const byField: Record<string, string> = {};
      if (apiError.details) {
        for (const d of apiError.details) {
          if (d.field) byField[d.field] = d.message;
        }
      }
      if (Object.keys(byField).length > 0) {
        setFieldErrors(byField);
      } else {
        setFormError(apiError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {formError && <Alert variant="destructive">{formError}</Alert>}

      <Field>
        <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la categoría"
          />
          <FieldError>{fieldErrors.name}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="category-description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="category-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la categoría (opcional)"
            rows={3}
          />
          <FieldDescription>
            Se mostrará junto al nombre en la lista de categorías.
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
              : 'Crear categoría'}
        </Button>
      </div>
    </form>
  );
}
