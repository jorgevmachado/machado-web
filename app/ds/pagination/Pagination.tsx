'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { PaginationProps } from './types';
import { joinClass } from '@/app/utils';


const MAX_VISIBLE_PAGES = 5;

const clampPage = (page: number, totalPages: number): number => {
  return Math.min(Math.max(page, 1), totalPages);
};

const buildVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const siblingCount = 1;
  const startPage = Math.max(1, currentPage - siblingCount);
  const endPage = Math.min(totalPages, currentPage + siblingCount);

  if (startPage <= 2) {
    return [1, 2, 3, 4, totalPages];
  }

  if (endPage >= totalPages - 1) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  isLoading = false,
  className,
  ariaLabel = 'Pagination',
}: PaginationProps) => {
  const normalizedCurrentPage = clampPage(currentPage, Math.max(totalPages, 1));
  const hasPreviousPage = normalizedCurrentPage > 1;
  const hasNextPage = normalizedCurrentPage < totalPages;

  const visiblePages = useMemo(() => {
    return buildVisiblePages(normalizedCurrentPage, totalPages);
  }, [normalizedCurrentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (isLoading || !onPageChange) {
      return;
    }

    onPageChange(clampPage(page, totalPages));
  };

  const baseButtonClassName = (isCurrent = false, disabled = false): string => {
    return joinClass([
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition',
      isCurrent
        ? 'border-blue-600 bg-blue-600 text-white'
        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700',
      disabled ? 'cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-700' : 'cursor-pointer',
    ]);
  };

  const renderPageControl = (page: number, isCurrent = false) => {
    const disabled = isCurrent || isLoading;
    const controlClassName = baseButtonClassName(isCurrent, disabled);
    const pageAriaLabel = `Go to page ${page}`;

    if (getPageHref && !disabled) {
      return (
        <Link href={getPageHref(page)} className={controlClassName} aria-label={pageAriaLabel}>
          {page}
        </Link>
      );
    }

    return (
      <button
        type='button'
        className={controlClassName}
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={pageAriaLabel}
      >
        {page}
      </button>
    );
  };

  const renderNavigationControl = (
    targetPage: number,
    icon: React.ReactNode,
    direction: 'previous' | 'next',
    disabled: boolean,
  ) => {
    const controlClassName = baseButtonClassName(false, disabled || isLoading);
    const controlAriaLabel = direction === 'previous' ? 'Go to previous page' : 'Go to next page';

    return (
      <button
        type='button'
        className={controlClassName}
        onClick={() => handlePageChange(targetPage)}
        disabled={disabled || isLoading}
        aria-label={controlAriaLabel}
      >
        {icon}
      </button>
    );
  };

  return (
    <nav className={joinClass(['flex items-center justify-center', className])} aria-label={ariaLabel}>
      <div className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm'>
        {renderNavigationControl(normalizedCurrentPage - 1, <MdChevronLeft size={18} />, 'previous', !hasPreviousPage)}

        {visiblePages.map((page, index) => {
          const showEllipsis = index > 0 && page - visiblePages[index - 1] > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis ? <span className='px-1 text-sm text-slate-400'>...</span> : null}
              {renderPageControl(page, page === normalizedCurrentPage)}
            </React.Fragment>
          );
        })}

        {renderNavigationControl(normalizedCurrentPage + 1, <MdChevronRight size={18} />, 'next', !hasNextPage)}
      </div>
    </nav>
  );
};

export type { PaginationProps };
export default React.memo(Pagination);

