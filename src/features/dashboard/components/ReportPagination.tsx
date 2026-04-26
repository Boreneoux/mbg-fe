'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationMeta } from '@/types/api';

type ReportPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export default function ReportPagination({ meta, onPageChange }: ReportPaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (meta.page > 1) {
                onPageChange(meta.page - 1);
              }
            }}
            className={meta.page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        <span className="px-3 text-sm text-muted-foreground">
          Page {meta.page} of {meta.totalPages}
        </span>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (meta.page < meta.totalPages) {
                onPageChange(meta.page + 1);
              }
            }}
            className={meta.page >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
