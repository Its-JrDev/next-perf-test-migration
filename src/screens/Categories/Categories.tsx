'use client';

import Link from 'next/link';
import { FolderTree } from 'lucide-react';
import { useAuth, useCategories } from '@/hooks';
import { CategoriesTemplate } from '@/components/templates';
import { useFormModal } from '@/components/organisms';
import { Card, CardContent } from '@/components/molecules';
import type { Category } from '@/types';

export function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const { openCreateCategory } = useFormModal();

  return (
    <CategoriesTemplate
      title="Categorías"
      subtitle="Navega las categorías para ver sus eventos."
      categories={categories}
      isLoading={isLoading}
      error={error}
      canCreate={!!isAdmin}
      onCreate={openCreateCategory}
      emptyIcon={FolderTree}
      emptyMessage="No hay categorías todavía."
      renderCategory={(category: Category, i: number) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="group animate-in fade-in block duration-200 ease-out motion-reduce:animate-none"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <h3 className="group-hover:text-primary font-semibold">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {category.description}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      )}
    />
  );
}
