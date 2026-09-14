import type { Event } from '@/types';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  events?: Event[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
