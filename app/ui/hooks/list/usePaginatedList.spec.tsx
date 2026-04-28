import { act, renderHook, waitFor } from '@testing-library/react';

import usePaginatedList from './usePaginatedList';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
}));

type MockedResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

type TestPokemon = {
  id: string;
  name: string;
};

type TestFilters = {
  name?: string;
  order?: string;
};

const INITIAL_FILTERS: TestFilters = {
  name: '',
  order: '',
};

const INITIAL_INPUT_FILTERS = [
  {
    label: 'NAME',
    type: 'text' as const,
    name: 'name',
    value: '',
    placeholder: 'Search by name',
  },
  {
    label: 'ORDER',
    type: 'text' as const,
    name: 'order',
    value: '',
    placeholder: 'Search by order',
  },
];

const createResponse = (json: unknown, ok = true): MockedResponse => ({
  ok,
  json: async () => json,
});

const createMeta = (overrides?: Partial<{
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}>) => ({
  total: 1,
  limit: 10,
  offset: 0,
  next_page: undefined,
  previous_page: undefined,
  total_pages: 1,
  current_page: 1,
  ...overrides,
});

const renderUsePaginatedList = () => {
  return renderHook(() => {
    return usePaginatedList<TestPokemon, TestFilters>({
      endpoint: '/api/test-pokemon',
      initialFilters: INITIAL_FILTERS,
      initialInputFilters: INITIAL_INPUT_FILTERS,
      fetchErrorMessage: 'Could not fetch test entries.',
      normalizeFilters: (nextFilters) => ({
        name: nextFilters.name?.trim(),
        order: nextFilters.order?.trim(),
      }),
    });
  });
};

describe('usePaginatedList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('fetches the initial page and exposes the loaded state', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [{ id: '1', name: 'pikachu' }],
      meta: createMeta(),
    }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/test-pokemon?page=1&limit=12', {
      method: 'GET',
      cache: 'no-store',
    });
    expect(result.current.items).toEqual([{ id: '1', name: 'pikachu' }]);
    expect(result.current.meta.current_page).toBe(1);
    expect(startContentLoadingMock).toHaveBeenCalledTimes(1);
    expect(stopContentLoadingMock).toHaveBeenCalledTimes(1);
  });

  it('syncs input filters and refetches with normalized filter values', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockResolvedValueOnce(createResponse({
        items: [],
        meta: createMeta({ total: 0, total_pages: 0 }),
      }) as Response)
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '25', name: 'pikachu' }],
        meta: createMeta(),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.applyInputFilters({
        name: ' pikachu ',
        order: ' 25 ',
      });
    });

    await waitFor(() => {
      expect(result.current.filters).toEqual({
        name: 'pikachu',
        order: '25',
      });
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith('/api/test-pokemon?page=1&limit=12&name=pikachu&order=25', {
        method: 'GET',
        cache: 'no-store',
      });
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '25', name: 'pikachu' }]);
    });

    expect(result.current.inputFilters.find((filter) => filter.name === 'name')?.value).toBe(' pikachu ');
    expect(result.current.inputFilters.find((filter) => filter.name === 'order')?.value).toBe(' 25 ');
  });

  it('clears input filters and refetches the first page without filters', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockResolvedValueOnce(createResponse({
        items: [],
        meta: createMeta({ total: 0, total_pages: 0 }),
      }) as Response)
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '25', name: 'pikachu' }],
        meta: createMeta(),
      }) as Response)
      .mockResolvedValueOnce(createResponse({
        items: [],
        meta: createMeta({ total: 0, total_pages: 0 }),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.applyInputFilters({
        name: ' bulbasaur ',
        order: ' 1 ',
      });
    });

    await waitFor(() => {
      expect(result.current.filters).toEqual({
        name: 'bulbasaur',
        order: '1',
      });
    });

    act(() => {
      result.current.clearInputFilters();
    });

    await waitFor(() => {
      expect(result.current.filters).toEqual({
        name: '',
        order: '',
      });
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith('/api/test-pokemon?page=1&limit=12', {
        method: 'GET',
        cache: 'no-store',
      });
    });

    expect(result.current.inputFilters.every((filter) => filter.value === '')).toBe(true);
  });
});
