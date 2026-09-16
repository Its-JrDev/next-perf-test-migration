'use client';
import { type ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader, Sidebar } from '@/components/organisms';
import { cn } from '@/utils/cn';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname() ?? '/';
  const side: 'left' | 'right' =
    pathname === '/' || pathname.startsWith('/events') ? 'left' : 'right';

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="bg-background flex min-h-screen">
      <div
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out md:block',
          collapsed ? 'w-0' : 'w-64',
          side === 'right' && 'order-last',
        )}
      >
        <Sidebar position={side} />
      </div>

      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 transition-transform duration-300 ease-in-out',
            side === 'right' ? 'right-0' : 'left-0',
            mobileOpen
              ? 'translate-x-0'
              : side === 'right'
                ? 'translate-x-full'
                : '-translate-x-full',
          )}
        >
          <Sidebar position={side} onClose={() => setMobileOpen(false)} />
        </div>
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          side === 'right' && 'order-first',
        )}
      >
        <AppHeader
          onMenuToggle={() => setMobileOpen(true)}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          sidebarCollapsed={collapsed}
          sidebarSide={side}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
