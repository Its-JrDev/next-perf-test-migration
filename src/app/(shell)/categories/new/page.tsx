import { RoleGuard } from '@/components/guards';
import { CategoriesPage } from '@/screens/Categories';

export default function NewCategoryRoute() {
  return (
    <RoleGuard roles={['admin']}>
      <CategoriesPage />
    </RoleGuard>
  );
}