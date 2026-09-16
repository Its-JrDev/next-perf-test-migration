'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules';
import { CategoryForm } from './CategoryForm';
import type { Category } from '@/types';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  category?: Category;
  onSaved?: (category: Category) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSaved,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar categoría' : 'Nueva categoría'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Actualiza el nombre o la descripción de la categoría.'
              : 'Las categorías agrupan eventos. Esta acción requiere rol de administrador.'}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          mode={mode}
          category={category}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
