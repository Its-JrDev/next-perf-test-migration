'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarRange, FolderTree, Heart, Home, X } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Separator } from '@/components/atoms';
import { cn } from '@/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  authOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/events', label: 'Eventos', icon: CalendarRange },
  { to: '/categories', label: 'Categorías', icon: FolderTree },
  { to: '/favorites', label: 'Favoritos', icon: Heart, authOnly: true },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname() ?? '/';

  const visibleItems = isAuthenticated
    ? NAV_ITEMS.filter((item) =>
        item.adminOnly ? user?.role === 'admin' : true,
      )
    : NAV_ITEMS.filter((item) => !item.adminOnly && !item.authOnly);

  const isActive = (to: string) =>
    to === '/' ? pathname === to : pathname.startsWith(to);

  return (
    <aside className="bg-sidebar flex h-full w-64 flex-col border-r">
      <div className="flex h-16 items-center gap-2 px-5">
        <CalendarRange className="text-primary size-6" />
        <span className="text-lg font-bold">Gestión</span>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-8 md:hidden"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            onClick={onClose}
            className={cn(
              'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(item.to) &&
                'bg-sidebar-accent text-sidebar-accent-foreground font-semibold',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
