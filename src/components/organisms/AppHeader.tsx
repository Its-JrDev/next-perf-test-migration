'use client';

import { PanelLeft, PanelLeftClose } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks';
import { Button, Separator } from '@/components/atoms';
import { cn } from '@/utils/cn';
import {
  CommandMenu,
  ProfileMenu,
  QuickActions,
  ThemeToggle,
} from '@/components/molecules';

interface AppHeaderProps {
  onMenuToggle: () => void;
  onCollapseToggle: () => void;
  sidebarCollapsed: boolean;
  sidebarSide: 'left' | 'right';
}

export function AppHeader({
  onMenuToggle,
  onCollapseToggle,
  sidebarCollapsed,
  sidebarSide,
}: AppHeaderProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'md:hidden',
            sidebarSide === 'right' && 'order-last',
          )}
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          <PanelLeft className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hidden md:inline-flex',
            sidebarSide === 'right' && 'order-last',
          )}
          onClick={onCollapseToggle}
          aria-label={
            sidebarCollapsed ? 'Mostrar barra lateral' : 'Ocultar barra lateral'
          }
          title={
            sidebarCollapsed ? 'Mostrar barra lateral' : 'Ocultar barra lateral'
          }
        >
          {sidebarCollapsed ? (
            <PanelLeft className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </Button>

        <CommandMenu />

        <div className="ml-auto flex items-center gap-1.5">
          {isAuthenticated && (
            <>
              <QuickActions />
              <Separator
                orientation="vertical"
                className="mx-1 hidden h-6 sm:block"
              />
            </>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
