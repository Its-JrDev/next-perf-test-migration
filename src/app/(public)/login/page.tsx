import { GuestGuard } from '@/components/guards';
import { LoginPage } from '@/screens/Login';

export default function LoginRoute() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}