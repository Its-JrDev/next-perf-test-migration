import { CategoryDetailPage } from '@/screens/Categories';

export default async function CategoryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryDetailPage id={id} />;
}