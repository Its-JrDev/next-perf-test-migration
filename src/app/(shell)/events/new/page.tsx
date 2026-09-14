import { RoleGuard } from '@/components/guards';
import { EventsPage } from '@/screens/Events';

export default function NewEventRoute() {
  return (
    <RoleGuard roles={['admin']}>
      <EventsPage />
    </RoleGuard>
  );
}