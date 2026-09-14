import { RoleGuard } from '@/components/guards';
import { CategoryDetailPage } from '@/screens/Categories';

export default async function EditCategoryRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RoleGuard roles={['admin']}>
      <CategoryDetailPage id={id} />
    </RoleGuard>
  );
}