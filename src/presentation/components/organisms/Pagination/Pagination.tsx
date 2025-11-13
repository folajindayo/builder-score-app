/**
 * Pagination Organism Component
 * Pagination controls with page numbers
 */

import { HTMLAttributes, forwardRef } from 'react';
import { Button } from '@atoms/Button';
import { IconButton } from '@atoms/IconButton';
import { Text } from '@atoms/Text';
import { ComponentProps } from '@presentation/types';

export interface PaginationProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  showFirstLast?: boolean;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblings = 1,
      showFirstLast = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const PrevIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    );

    const NextIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );

    const generatePageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      
      // Always show first page
      pages.push(1);

      // Calculate range
      const start = Math.max(2, currentPage - siblings);
      const end = Math.min(totalPages - 1, currentPage + siblings);

      // Add ellipsis after first if needed
      if (start > 2) {
        pages.push('ellipsis');
      }

      // Add sibling pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
    };

    const pages = generatePageNumbers();

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={`flex items-center justify-center gap-2 ${className}`}
        {...props}
      >
        {/* First Page */}
        {showFirstLast && (
          <IconButton
            icon={<span className="font-medium">{"<<"}</span>}
            variant="ghost"
            size="sm"
            aria-label="First page"
            isDisabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
        )}

        {/* Previous Page */}
        <IconButton
          icon={PrevIcon}
          variant="ghost"
          size="sm"
          aria-label="Previous page"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <Text key={`ellipsis-${index}`} className="px-2">
              ...
            </Text>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'solid' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )
        )}

        {/* Next Page */}
        <IconButton
          icon={NextIcon}
          variant="ghost"
          size="sm"
          aria-label="Next page"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />

        {/* Last Page */}
        {showFirstLast && (
          <IconButton
            icon={<span className="font-medium">{">>"}</span>}
            variant="ghost"
            size="sm"
            aria-label="Last page"
            isDisabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

