'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFetch, useEventList } from '@/hooks';
import { categoryService } from '@/services';
import { EventsTemplate } from '@/components/templates';
import { useFormModal } from '@/components/organisms';
import type { Category } from '@/types';

export function EventsPage() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const {
    events,
    paginated,
    isLoading,
    error,
    search,
    categoryId,
    setSearch,
    setCategory,
    goToPage,
    limit,
    setLimit,
    refetch,
  } = useEventList();
  const { openCreateEvent, dataRefreshed } = useFormModal();

  const categoriesFetch = useFetch<Category[]>(() =>
    categoryService.getCategories(),
  );
  const categories = categoriesFetch.data ?? [];

  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputValue), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (dataRefreshed > 0) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRefreshed]);

  const props = {
    title: 'Eventos',
    subtitle: `${paginated.total} eventos encontrados`,
    events,
    categories,
    search: inputValue,
    categoryId,
    onSearchChange: setInputValue,
    onCategoryChange: setCategory,
    isLoading,
    error,
    canCreate: isAdmin,
    onCreate: () => openCreateEvent(),
    currentPage: paginated.page,
    totalPages: paginated.totalPages,
    pageSize: limit,
    onPageChange: goToPage,
    onPageSizeChange: setLimit,
  };

  return <EventsTemplate {...props} />;
}
