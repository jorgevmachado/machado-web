import { TPaginatedList } from '@/app/utils/pagination/types';


export class Pagination<T> {
  default_page_size: number = 12;

  toPositiveInteger(value: string | null, fallback: number): number {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      return fallback;
    }

    return parsedValue;
  }

  paginateInMemory(items: Array<T>, requestedPage: number): Pick<TPaginatedList<T>, 'items' | 'pagination'> {
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / this.default_page_size));
    const currentPage = Math.min(requestedPage, totalPages);
    const startIndex = (currentPage - 1) * this.default_page_size;
    const paginatedItems = items.slice(startIndex, startIndex + this.default_page_size);

    return {
      items: paginatedItems,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        pageSize: this.default_page_size,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }
}