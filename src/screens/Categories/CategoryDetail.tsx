'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth, useFetch } from '@/hooks';
import { categoryService, eventService, toApiError } from '@/services';
import { CategoryDetailTemplate } from '@/components/templates';
import { useFormModal } from '@/components/organisms';
import type { Category, Event } from '@/types';

interface CategoryDetailPageProps {
  id: string;
}

export function CategoryDetailPage({ id }: CategoryDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const { openCreateEvent, openEditCategory, dataRefreshed } = useFormModal();

  const categoryFetch = useFetch<Category>(
    () => categoryService.getCategoryById(id),
    [id],
  );

  const eventsFetch = useFetch<Event[]>(
    () => eventService.getEvents({ categoryId: id }),
    [id],
  );

  const category = categoryFetch.data;

  useEffect(() => {
    if (dataRefreshed > 0) {
      eventsFetch.refetch();
      categoryFetch.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRefreshed]);

  const handleDelete = async () => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Categoría eliminada');
      router.push('/categories');
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  return (
    <CategoryDetailTemplate
      category={category}
      categoryLoading={categoryFetch.isLoading}
      categoryError={categoryFetch.error}
      events={eventsFetch.data ?? []}
      eventsLoading={eventsFetch.isLoading}
      eventsError={eventsFetch.error}
      isAuthenticated={isAuthenticated}
      isAdmin={!!isAdmin}
      onBack={() => router.push('/categories')}
      onCreateEvent={() => openCreateEvent({ categoryId: id, locked: true })}
      onEditCategory={() => category && openEditCategory(category)}
      onDeleteCategory={handleDelete}
    />
  );
}
