/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/hooks';
import { CategoryFormDialog } from './CategoryFormDialog';
import { EventFormDialog } from './EventFormDialog';
import type { Category, Event } from '@/types';

interface FormModalContextValue {
  dataRefreshed: number;
  openCreateEvent: (opts?: { categoryId?: string; locked?: boolean }) => void;
  openEditEvent: (event: Event) => void;
  openCreateCategory: () => void;
  openEditCategory: (category: Category) => void;
}

const FormModalContext = createContext<FormModalContextValue | null>(null);

interface EventModalState {
  mode: 'create' | 'edit';
  event?: Event;
  categoryId?: string;
  locked?: boolean;
}

export function useFormModal(): FormModalContextValue {
  const ctx = useContext(FormModalContext);
  if (!ctx) {
    throw new Error('useFormModal debe usarse dentro de <FormModalHost>');
  }
  return ctx;
}

export function FormModalHost({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const [eventModal, setEventModal] = useState<EventModalState | null>(null);
  const [categoryModal, setCategoryModal] = useState<{
    mode: 'create' | 'edit';
    category?: Category;
  } | null>(null);
  const [dataRefreshed, setDataRefreshed] = useState(0);

  const effectiveEventModal = isAdmin ? eventModal : null;
  const effectiveCategoryModal = isAdmin ? categoryModal : null;

  const handleSaved = useCallback(() => {
    setDataRefreshed((v) => v + 1);
    setEventModal(null);
    setCategoryModal(null);
  }, []);

  const value = useMemo<FormModalContextValue>(
    () => ({
      dataRefreshed,
      openCreateEvent: (opts) => {
        if (!isAdmin) return;
        setEventModal({
          mode: 'create',
          categoryId: opts?.categoryId,
          locked: opts?.locked,
        });
      },
      openEditEvent: (event) => {
        if (!isAdmin) return;
        setEventModal({ mode: 'edit', event });
      },
      openCreateCategory: () => {
        if (!isAdmin) return;
        setCategoryModal({ mode: 'create' });
      },
      openEditCategory: (category) => {
        if (!isAdmin) return;
        setCategoryModal({ mode: 'edit', category });
      },
    }),
    [dataRefreshed, isAdmin],
  );

  return (
    <FormModalContext.Provider value={value}>
      {children}

      <EventFormDialog
        open={!!effectiveEventModal}
        onOpenChange={(open) => !open && setEventModal(null)}
        mode={effectiveEventModal?.mode ?? 'create'}
        event={
          effectiveEventModal?.mode === 'edit' ? effectiveEventModal.event : undefined
        }
        defaultCategoryId={effectiveEventModal?.categoryId}
        categoryLocked={effectiveEventModal?.locked ?? false}
        onSaved={handleSaved}
      />

      <CategoryFormDialog
        open={!!effectiveCategoryModal}
        onOpenChange={(open) => !open && setCategoryModal(null)}
        mode={effectiveCategoryModal?.mode ?? 'create'}
        category={
          effectiveCategoryModal?.mode === 'edit'
            ? effectiveCategoryModal.category
            : undefined
        }
        onSaved={handleSaved}
      />
    </FormModalContext.Provider>
  );
}
