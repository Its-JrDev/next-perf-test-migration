'use client';

import {
  AppProvider,
  AuthProvider,
  ErrorBoundary,
  FavoritesProvider,
} from '@/providers';
import { Toaster } from '@/components/molecules';
import { FormModalHost } from '@/components/organisms';

export function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ErrorBoundary>
            <FormModalHost>
              {children}
              <Toaster position="top-right" richColors />
            </FormModalHost>
          </ErrorBoundary>
        </FavoritesProvider>
      </AuthProvider>
    </AppProvider>
  );
}