'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth, useFetch } from '@/hooks';
import { eventService, toApiError } from '@/services';
import { EventDetailTemplate } from '@/components/templates';
import { useFormModal } from '@/components/organisms';
import type { Event as EventType } from '@/types';

interface EventDetailPageProps {
  id: string;
}

export function EventDetailPage({ id }: EventDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openEditEvent, dataRefreshed } = useFormModal();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useFetch<EventType>(() => eventService.getEventById(id), [id]);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (dataRefreshed > 0) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRefreshed]);

  const handleDelete = async () => {
    if (!event) return;

    const eventId = event.id;
    if (!eventId) return;

    setDeleting(true);
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Evento eliminado');
      router.push('/events');
    } catch (err) {
      toast.error(toApiError(err).message);
      setDeleting(false);
    }
  };

  return (
    <EventDetailTemplate
      event={event}
      isLoading={isLoading}
      error={error}
      canEdit={user?.role === 'admin'}
      deleting={deleting}
      onBack={() => router.back()}
      onEdit={() => event && openEditEvent(event)}
      onDelete={handleDelete}
    />
  );
}
