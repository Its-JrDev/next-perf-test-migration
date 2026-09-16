'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules';
import { EventForm } from './EventForm';
import type { Event } from '@/types';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  event?: Event;
  defaultCategoryId?: string;
  categoryLocked?: boolean;
  onSaved?: (event: Event) => void;
}

export function EventFormDialog({
  open,
  onOpenChange,
  mode,
  event,
  defaultCategoryId,
  categoryLocked = false,
  onSaved,
}: EventFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar evento' : 'Nuevo evento'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Actualizá la información del evento.'
              : defaultCategoryId
                ? 'El evento se creará dentro de esta categoría.'
                : 'Completá los datos del evento para publicarlo.'}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          mode={mode}
          event={event}
          defaultCategoryId={defaultCategoryId}
          categoryLocked={categoryLocked}
          onSaved={onSaved}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
