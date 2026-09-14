import { CalendarPlus, FolderPlus, Plus } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Separator } from '@/components/atoms';
import { useFormModal } from '@/components/organisms';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function QuickActions() {
  const { user } = useAuth();
  const { openCreateEvent, openCreateCategory } = useFormModal();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Acciones rápidas"
          title="Acciones rápidas"
        >
          <Plus className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 p-2">
        <div className="grid gap-1">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={() => openCreateEvent()}
          >
            <CalendarPlus className="size-4" />
            Nuevo evento
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={openCreateCategory}
          >
            <FolderPlus className="size-4" />
            Nueva categoría
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
