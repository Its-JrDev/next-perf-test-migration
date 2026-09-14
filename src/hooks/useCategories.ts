import { useCallback } from 'react';
import { categoryService } from '@/services/category.service';
import { toApiError } from '@/services/errors';
import { useFetch } from '@/hooks/useFetch';
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/types';

export const useCategories = () => {
  const list = useFetch<Category[]>(() => categoryService.getCategories());

  const createCategory = useCallback(
    async (payload: CreateCategoryPayload): Promise<Category> => {
      try {
        const created = await categoryService.createCategory(payload);
        await list.refetch();
        return created;
      } catch (err) {
        throw toApiError(err);
      }
    },
    [list],
  );

  const updateCategory = useCallback(
    async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
      try {
        const updated = await categoryService.updateCategory(id, payload);
        await list.refetch();
        return updated;
      } catch (err) {
        throw toApiError(err);
      }
    },
    [list],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<void> => {
      try {
        await categoryService.deleteCategory(id);
        await list.refetch();
      } catch (err) {
        throw toApiError(err);
      }
    },
    [list],
  );

  return {
    categories: list.data ?? [],
    isLoading: list.isLoading,
    error: list.error,
    refetch: list.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
