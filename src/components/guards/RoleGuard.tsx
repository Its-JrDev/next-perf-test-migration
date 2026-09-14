'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import type { Role } from '@/types';

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!user || !roles.includes(user.role)) {
      router.replace('/forbidden');
    }
  }, [isLoading, isAuthenticated, user, roles, router]);

  if (isLoading || !isAuthenticated || !user || !roles.includes(user.role)) {
    return null;
  }

  return children;
}