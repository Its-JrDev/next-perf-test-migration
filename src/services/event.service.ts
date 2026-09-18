import api from '@/services/api.client';
import type {
  Event,
  CreateEventPayload,
  UpdateEventPayload,
  EventQueryParams,
} from '@/types';

export const eventService = {
  async getEvents(
    query: EventQueryParams = {},
  ): Promise<Event[]> {
    const { data } = await api.get<Event[]>('/events', {
      params: query as Record<string, unknown>,
    });
    return data;
  },

  async getEventById(id: string): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  async createEvent(payload: CreateEventPayload): Promise<Event> {
    // 401/403 and validation errors are
    // intentionally allowed to reach the form for user-facing feedback.
    const { data } = await api.post<Event>('/events', payload);
    return data;
  },

  async updateEvent(id: string, payload: UpdateEventPayload): Promise<Event> {
    const { data } = await api.patch<Event>(`/events/${id}`, payload);
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
