import type { Category, ISODateString } from '@/types';

export interface EventImage {
  id: string;
  url: string;
  order: number;
  eventId: string;
  createdAt?: ISODateString | string;
}

export interface Event {
  id: string;
  name: string;
  description: string | null;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  category: Category;
  images: EventImage[];
  createdAt: ISODateString | string;
  updatedAt: ISODateString | string;
}

export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: string;
  images?: string[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface EventQueryParams {
  search?: string;
  categoryId?: string;
}
