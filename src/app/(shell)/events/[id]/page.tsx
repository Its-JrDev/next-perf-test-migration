import { EventDetailPage } from '@/screens/Events';

export default async function EventDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailPage id={id} />;
}