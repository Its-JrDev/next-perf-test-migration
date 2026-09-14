import type { Event, ISODateString } from '@/types';

export interface Favorite {
  id: string;
  userId: string;
  eventId: string;
  createdAt?: ISODateString | string;
}

export type FavoriteEvent = Event;
