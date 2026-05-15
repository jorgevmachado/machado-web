import { renderHook } from '@testing-library/react';

import { usePokedexList } from './usePokedexList';

const usePaginatedListMock = jest.fn();

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/app/ui/hooks/list/usePaginatedList', () => ({
  __esModule: true,
  default: function usePaginatedList(...args: unknown[]) {
    return usePaginatedListMock(...args);
  },
}));

describe('usePokedexList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePaginatedListMock.mockReturnValue({
      items: [],
      meta: { total: 0, current_page: 1, total_pages: 0 },
      isLoading: false,
      errorMessage: undefined,
      inputFilters: [],
      goToPage: jest.fn(),
      applyInputFilters: jest.fn(),
      clearInputFilters: jest.fn(),
    });
  });

  it('delegates to the paginated list hook with pokedex settings', () => {
    renderHook(() => usePokedexList());

    expect(usePaginatedListMock).toHaveBeenCalledWith(expect.objectContaining({
      endpoint: '/api/trainer/pokedex',
      fetchErrorMessage: 'pokedex.list.loadError',
    }));
  });

  it('normalizes blank filter values to undefined before delegating', () => {
    renderHook(() => usePokedexList());

    const config = usePaginatedListMock.mock.calls[0][0] as {
      normalizeFilters: (filters: { nickname?: string; pokemon_name?: string; discovered?: string }) => {
        nickname?: string;
        pokemon_name?: string;
        discovered?: string;
      };
    };

    expect(config.normalizeFilters({ nickname: '  Leaf  ', pokemon_name: '  bulbasaur  ', discovered: ' TRUE ' })).toEqual({
      nickname: 'Leaf',
      pokemon_name: 'bulbasaur',
      discovered: 'true',
    });
    expect(config.normalizeFilters({ nickname: '   ', pokemon_name: '', discovered: ' ' })).toEqual({
      nickname: undefined,
      pokemon_name: undefined,
      discovered: undefined,
    });
  });
});
