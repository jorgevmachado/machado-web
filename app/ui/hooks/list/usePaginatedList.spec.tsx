import { act, renderHook, waitFor } from '@testing-library/react';

import usePaginatedList from './usePaginatedList';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const translateMock = (key: string) => key === 'missing.translation' ? undefined : 'Unknown';

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: translateMock,
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

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
};

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

const renderUsePaginatedListWithBuilder = (buildQueryString: (page: number, limit: number, filters: TestFilters) => string) => {
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
      buildQueryString,
    });
  });
};

const renderUsePaginatedListWithProps = (initialInputFilters: typeof INITIAL_INPUT_FILTERS) => {
  return renderHook(({ nextInputFilters }) => {
    return usePaginatedList<TestPokemon, TestFilters>({
      endpoint: '/api/test-pokemon',
      initialFilters: INITIAL_FILTERS,
      initialInputFilters: nextInputFilters,
      fetchErrorMessage: 'Could not fetch test entries.',
      normalizeFilters: (nextFilters) => ({
        name: nextFilters.name?.trim(),
        order: nextFilters.order?.trim(),
      }),
    });
  }, {
    initialProps: {
      nextInputFilters: initialInputFilters,
    },
  });
};

const renderUsePaginatedListWithFetchList = (fetchList: jest.Mock) => {
  return renderHook(() => {
    return usePaginatedList<TestPokemon, TestFilters>({
      fetchList,
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

  it('supports the fetchList mode without hitting fetch', async () => {
    const fetchList = jest.fn().mockResolvedValueOnce({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'common.unknown',
      data: {
        items: [{ id: '1', name: 'pikachu' }],
        meta: createMeta(),
      },
    });

    const { result } = renderUsePaginatedListWithFetchList(fetchList);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchList).toHaveBeenCalledWith(INITIAL_FILTERS, 1, 12);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.items).toEqual([{ id: '1', name: 'pikachu' }]);
  });

  it('surfaces a configuration error when neither fetchList nor endpoint is provided', async () => {
    const { result } = renderHook(() => usePaginatedList<TestPokemon, TestFilters>({
      initialFilters: INITIAL_FILTERS,
      initialInputFilters: INITIAL_INPUT_FILTERS,
      fetchErrorMessage: 'Could not fetch test entries.',
      normalizeFilters: (nextFilters) => nextFilters,
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('usePaginatedList requires either fetchList or endpoint.');
  });

  it('uses the endpoint without a query string and translates fetchList-mode errors with empty messages', async () => {
    const fetchMock = global.fetch as jest.Mock;
    const fetchList = jest.fn()
      .mockResolvedValueOnce({
        error: true,
        status: 500,
        message: '',
        i18nMessage: 'common.unknown',
      })
      .mockResolvedValueOnce({
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'common.unknown',
        data: {
          items: [],
          meta: createMeta({ total: 0, total_pages: 0 }),
        },
      });

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [],
      meta: createMeta({ total: 0, total_pages: 0 }),
    }) as Response);

    renderUsePaginatedListWithBuilder(() => '');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/test-pokemon', {
        method: 'GET',
        cache: 'no-store',
      });
    });

    const hook = renderUsePaginatedListWithFetchList(fetchList);

    await waitFor(() => {
      expect(hook.result.current.isLoading).toBe(false);
    });

    expect(hook.result.current.errorMessage).toBe('Unknown');
  });

  it('falls back to the configured fetch error message when translation is unavailable', async () => {
    const fetchList = jest.fn().mockResolvedValueOnce({
      error: true,
      status: 500,
      message: '',
      i18nMessage: 'missing.translation',
    });

    const hook = renderHook(() => usePaginatedList<TestPokemon, TestFilters>({
      fetchList,
      initialFilters: INITIAL_FILTERS,
      initialInputFilters: INITIAL_INPUT_FILTERS,
      fetchErrorMessage: 'Could not fetch test entries.',
      normalizeFilters: (nextFilters) => nextFilters,
    }));

    await waitFor(() => {
      expect(hook.result.current.isLoading).toBe(false);
    });

    expect(hook.result.current.errorMessage).toBe('Could not fetch test entries.');
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

  it('uses an empty string when an input filter value is omitted', async () => {
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
      result.current.applyInputFilters({ name: 'pikachu' });
    });

    await waitFor(() => {
      expect(result.current.inputFilters.find((filter) => filter.name === 'order')?.value).toBe('');
    });
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

  it('handles invalid response payloads with the configured fallback message', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({ message: 'Invalid payload' }, false) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Invalid payload');
  });

  it('uses the configured fallback message for invalid responses without messages', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({ unexpected: true }, true) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Could not fetch test entries.');
  });

  it('handles fetch exceptions and supports reload', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockRejectedValueOnce(new Error('Network down'))
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '7', name: 'squirtle' }],
        meta: createMeta({ current_page: 1 }),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Network down');
    });

    act(() => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '7', name: 'squirtle' }]);
    });
  });

  it('uses the configured fallback message for non-error exceptions', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockRejectedValueOnce('offline');

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Could not fetch test entries.');
    });
  });

  it('ignores stale successful responses after a newer request starts', async () => {
    const fetchMock = global.fetch as jest.Mock;
    const initialResponse = createDeferred<Response>();

    fetchMock
      .mockReturnValueOnce(initialResponse.promise)
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '2', name: 'ivysaur' }],
        meta: createMeta({ total_pages: 1, current_page: 1 }),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.applyFilters({ name: 'ivysaur', order: '' });
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '2', name: 'ivysaur' }]);
    });

    await act(async () => {
      initialResponse.resolve(createResponse({
        items: [{ id: '1', name: 'bulbasaur' }],
        meta: createMeta({ total_pages: 1, current_page: 1 }),
      }) as Response);
      await initialResponse.promise;
    });

    expect(result.current.items).toEqual([{ id: '2', name: 'ivysaur' }]);
  });

  it('ignores stale rejected responses after a newer request starts', async () => {
    const fetchMock = global.fetch as jest.Mock;
    const initialResponse = createDeferred<Response>();

    fetchMock
      .mockReturnValueOnce(initialResponse.promise)
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '2', name: 'ivysaur' }],
        meta: createMeta({ total_pages: 1, current_page: 1 }),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.applyFilters({ name: 'ivysaur', order: '' });
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '2', name: 'ivysaur' }]);
    });

    await act(async () => {
      initialResponse.reject(new Error('Stale failure'));
      await initialResponse.promise.catch(() => undefined);
    });

    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.items).toEqual([{ id: '2', name: 'ivysaur' }]);
  });
  it('goes to another page and clamps out-of-range current pages from the response', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '1', name: 'bulbasaur' }],
        meta: createMeta({ total_pages: 3, current_page: 1 }),
      }) as Response)
      .mockResolvedValueOnce(createResponse({
        items: [{ id: '2', name: 'ivysaur' }],
        meta: createMeta({ total_pages: 3, current_page: 99 }),
      }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.goToPage(2);
    });

    await waitFor(() => {
      expect(result.current.items).toEqual([{ id: '2', name: 'ivysaur' }]);
    });

    expect(result.current.meta.current_page).toBe(3);
  });

  it('does not refetch when requested page is current or loading', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [{ id: '1', name: 'bulbasaur' }],
      meta: createMeta({ total_pages: 3, current_page: 1 }),
    }) as Response);

    const { result } = renderUsePaginatedList();

    act(() => {
      result.current.goToPage(2);
    });

    expect(fetchMock).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.goToPage(1);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('updates input filters without fetching', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [],
      meta: createMeta({ total: 0, total_pages: 0 }),
    }) as Response);

    const { result } = renderUsePaginatedList();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateInputFilters([
        { ...INITIAL_INPUT_FILTERS[0], value: 'mew' },
      ]);
    });

    expect(result.current.inputFilters).toEqual([
      { ...INITIAL_INPUT_FILTERS[0], value: 'mew' },
      INITIAL_INPUT_FILTERS[1],
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('syncs translated input filter metadata without losing entered values', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [],
      meta: createMeta({ total: 0, total_pages: 0 }),
    }) as Response);

    const { result, rerender } = renderUsePaginatedListWithProps(INITIAL_INPUT_FILTERS);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.applyInputFilters({
        name: 'pikachu',
        order: '25',
      });
    });

    const translatedInputFilters = [
      {
        ...INITIAL_INPUT_FILTERS[0],
        label: 'NOMBRE',
        placeholder: 'Buscar por nombre',
      },
      {
        ...INITIAL_INPUT_FILTERS[1],
        label: 'ORDEN',
        placeholder: 'Buscar por orden',
      },
    ];

    rerender({
      nextInputFilters: translatedInputFilters,
    });

    await waitFor(() => {
      expect(result.current.inputFilters).toEqual([
        {
          ...translatedInputFilters[0],
          value: 'pikachu',
        },
        {
          ...translatedInputFilters[1],
          value: '25',
        },
      ]);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('supports a custom query string builder', async () => {
    const fetchMock = global.fetch as jest.Mock;
    const buildQueryString = jest.fn(() => 'custom=true');

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [{ id: '9', name: 'blastoise' }],
      meta: createMeta(),
    }) as Response);

    const { result } = renderUsePaginatedListWithBuilder(buildQueryString);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(buildQueryString).toHaveBeenCalledWith(1, 12, INITIAL_FILTERS);
    expect(fetchMock).toHaveBeenCalledWith('/api/test-pokemon?custom=true', {
      method: 'GET',
      cache: 'no-store',
    });
  });

  it('adds newly introduced input filters when translated metadata changes', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({
      items: [],
      meta: createMeta({ total: 0, total_pages: 0 }),
    }) as Response);

    const { result, rerender } = renderUsePaginatedListWithProps(INITIAL_INPUT_FILTERS);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const nextInputFilters = [
      ...INITIAL_INPUT_FILTERS,
      {
        label: 'STATUS',
        type: 'text' as const,
        name: 'status',
        value: 'active',
        placeholder: 'Search by status',
      },
    ];

    rerender({
      nextInputFilters,
    });

    await waitFor(() => {
      expect(result.current.inputFilters).toEqual([
        INITIAL_INPUT_FILTERS[0],
        INITIAL_INPUT_FILTERS[1],
        {
          ...nextInputFilters[2],
          value: '',
        },
      ]);
    });
  });
});
