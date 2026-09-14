'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/templates';

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AppShell>
      <div
        key={pathname}
        className="animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none"
      >
        {children}
      </div>
    </AppShell>
  );
}