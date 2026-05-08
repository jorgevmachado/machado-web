import { Pagination } from './pagination';

describe('Pagination', () => {
  it('parses positive integers', () => {
    const pagination = new Pagination<string>();

    expect(pagination.toPositiveInteger('2', 1)).toBe(2);
    expect(pagination.toPositiveInteger('0', 1)).toBe(1);
    expect(pagination.toPositiveInteger(null, 5)).toBe(5);
  });

  it('paginates items in memory and clamps pages', () => {
    const pagination = new Pagination<number>();
    pagination.default_page_size = 2;

    expect(pagination.paginateInMemory([1, 2, 3], 1)).toEqual({
      items: [1, 2],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 3,
        pageSize: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });

    expect(pagination.paginateInMemory([1, 2, 3], 99)).toEqual({
      items: [3],
      pagination: {
        currentPage: 2,
        totalPages: 2,
        totalItems: 3,
        pageSize: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });
  });
});
