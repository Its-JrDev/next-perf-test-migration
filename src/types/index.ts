export type { Role, User } from './user.types';
export type { LoginPayload, RegisterPayload, AuthResponse } from './auth.types';
export type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from './category.types';

export type {
  Event,
  CreateEventPayload,
  UpdateEventPayload,
  EventQueryParams,
} from './event.types';

export type { Favorite, FavoriteEvent } from './favorite.types';

export type ISODateString = `${string}T${string}Z`;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
