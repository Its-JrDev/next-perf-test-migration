import { type ReactNode, useEffect, useState } from 'react';
import { AppHeader, Sidebar } from '@/components/organisms';
import { cn } from '@/utils/cn';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
        )}
      >
        <Sidebar />
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
            'absolute inset-y-0 left-0 transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar onClose={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          onMenuToggle={() => setMobileOpen(true)}
          onCollapseToggle={() => setCollapsed((v) => !v)}
          sidebarCollapsed={collapsed}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
