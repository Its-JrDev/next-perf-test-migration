'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarRange,
  FolderTree,
  Heart,
  Home,
  LogOut,
  Plus,
  Search,
  SunMoon,
} from 'lucide-react';
import { useAuth, useApp } from '@/hooks';
import { Button } from '@/components/atoms';
import { useFormModal } from '@/components/organisms';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/molecules/command';

interface CommandAction {
  id: string;
  label: string;
  keywords?: string[];
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useApp();
  const { openCreateEvent, openCreateCategory } = useFormModal();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    router.push(to);
  };

  const openEvent = () => {
    setOpen(false);
    openCreateEvent();
  };

  const openCategory = () => {
    setOpen(false);
    openCreateCategory();
  };

  const actions: CommandAction[] = [
    { id: 'home', label: 'Inicio', icon: Home, onSelect: () => go('/') },
    {
      id: 'events',
      label: 'Eventos',
      icon: CalendarRange,
      onSelect: () => go('/events'),
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: FolderTree,
      onSelect: () => go('/categories'),
    },
    {
      id: 'favorites',
      label: 'Mis favoritos',
      icon: Heart,
      onSelect: () => go('/favorites'),
    },
    {
      id: 'new-event',
      label: 'Nuevo evento',
      keywords: ['crear', 'evento', 'agregar'],
      icon: Plus,
      onSelect: openEvent,
    },
    ...(isAdmin
      ? [
          {
            id: 'new-category',
            label: 'Nueva categoría',
            keywords: ['crear', 'categoría'],
            icon: Plus,
            onSelect: openCategory,
          },
        ]
      : []),
  ];

  const preferences: CommandAction[] = [
    {
      id: 'toggle-theme',
      label: 'Cambiar tema',
      keywords: ['oscuro', 'claro', 'dark', 'light', 'modo'],
      icon: SunMoon,
      onSelect: () => {
        setOpen(false);
        setTheme(theme === 'dark' ? 'light' : 'dark');
      },
    },
  ];

  const sessionActions: CommandAction[] = [
    {
      id: 'logout',
      label: 'Cerrar sesión',
      icon: LogOut,
      onSelect: () => {
        setOpen(false);
        void logout().then(() => router.replace('/login'));
      },
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir búsqueda"
      >
        <Search className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="bg-background text-muted-foreground hover:bg-background hover:text-muted-foreground hidden w-72 justify-start gap-3 rounded-lg md:inline-flex lg:w-80"
        onClick={() => setOpen(true)}
        aria-label="Abrir búsqueda"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Buscar o navegar…</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar eventos, categorías, acciones…" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Navegación">
            {actions.map((action) => (
              <CommandItem
                key={action.id}
                keywords={action.keywords}
                onSelect={action.onSelect}
              >
                <action.icon />
                {action.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Preferencias">
            {preferences.map((action) => (
              <CommandItem
                key={action.id}
                keywords={action.keywords}
                onSelect={action.onSelect}
              >
                <action.icon />
                {action.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Sesión">
            {sessionActions.map((action) => (
              <CommandItem
                key={action.id}
                keywords={action.keywords}
                onSelect={action.onSelect}
              >
                <action.icon />
                {action.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
