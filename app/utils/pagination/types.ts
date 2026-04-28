export type TPaginationResponse<T> = {
  items: Array<T>;
  total: number;
  limit: number;
  offset: number;
}

export type TPaginated = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type TPaginatedList<T> = {
  items: Array<T>;
  pagination:TPaginated;
}