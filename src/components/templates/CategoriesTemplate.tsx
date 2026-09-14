import { Plus, type LucideIcon } from 'lucide-react';
import { Button, Skeleton } from '@/components/atoms';
import { Alert, AlertDescription, AlertTitle } from '@/components/molecules';
import type { Category } from '@/types';

interface CategoriesTemplateProps {
  title: string;
  subtitle: string;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  canCreate: boolean;
  onCreate: () => void;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  renderCategory: (category: Category, index: number) => React.ReactNode;
}

export function CategoriesTemplate({
  title,
  subtitle,
  categories,
  isLoading,
  error,
  canCreate,
  onCreate,
  emptyIcon: EmptyIcon,
  emptyMessage,
  renderCategory,
}: CategoriesTemplateProps) {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {canCreate && (
          <Button onClick={onCreate}>
            <Plus className="size-4" />
            Nueva categoría
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : !error && categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <EmptyIcon className="text-muted-foreground size-10" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => renderCategory(category, i))}
        </div>
      )}
    </div>
  );
}
