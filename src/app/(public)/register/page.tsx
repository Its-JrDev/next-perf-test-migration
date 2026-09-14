import { GuestGuard } from '@/components/guards';
import { RegisterPage } from '@/screens/Register';

export default function RegisterRoute() {
  return (
    <GuestGuard>
      <RegisterPage />
    </GuestGuard>
  );
}