import { AuthGuard } from '@/components/guards';
import { ForbiddenPage } from '@/screens/Forbidden';

export default function ForbiddenRoute() {
  return (
    <AuthGuard>
      <ForbiddenPage />
    </AuthGuard>
  );
}