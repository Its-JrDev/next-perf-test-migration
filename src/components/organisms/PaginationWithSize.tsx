import { ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/utils/cn';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules';

const PAGE_SIZES = [9, 12, 24, 50];

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  const items: PageItem[] = [];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  items.push(1);
  if (left > 2) items.push('ellipsis-start');
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push('ellipsis-end');
  if (totalPages > 1) items.push(totalPages);

  return items;
}

interface PaginationWithSizeProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Ir a la primera página"
    size="icon"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronsLeft className="size-4" />
  </PaginationLink>
);
PaginationFirst.displayName = 'PaginationFirst';

const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Ir a la última página"
    size="icon"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <ChevronsRight className="size-4" />
  </PaginationLink>
);
PaginationLast.displayName = 'PaginationLast';

export function PaginationWithSize({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationWithSizeProps) {
  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  const hasPages = totalPages > 1;
  const atFirst = !hasPages || currentPage <= 1;
  const atLast = !hasPages || currentPage >= totalPages;
  const items = hasPages ? getPageItems(currentPage, totalPages) : [];

  return (
    <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="hidden sm:block" />

      <Pagination className="w-auto max-w-full justify-center overflow-x-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={() => go(1)}
              className={atFirst ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => go(currentPage - 1)}
              className={atFirst ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {items.map((item, i) =>
            typeof item === 'number' ? (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => go(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={`${item}-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => go(currentPage + 1)}
              className={atLast ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={() => go(totalPages)}
              className={atLast ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          Items por página
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="h-9 w-18">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
