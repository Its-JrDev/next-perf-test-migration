import { RoleGuard } from '@/components/guards';
import { EventDetailPage } from '@/screens/Events';

export default async function EditEventRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RoleGuard roles={['admin']}>
      <EventDetailPage id={id} />
    </RoleGuard>
  );
}