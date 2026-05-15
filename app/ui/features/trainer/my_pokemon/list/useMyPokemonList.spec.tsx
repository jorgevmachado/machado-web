import { renderHook } from '@testing-library/react';

import { useMyPokemonList } from './useMyPokemonList';

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

describe('useMyPokemonList', () => {
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

  it('delegates to the paginated list hook with my-pokemon settings', () => {
    renderHook(() => useMyPokemonList());

    expect(usePaginatedListMock).toHaveBeenCalledWith(expect.objectContaining({
      endpoint: '/api/trainer/my-pokemon',
      fetchErrorMessage: 'myPokemon.list.loadError',
    }));
  });

  it('normalizes blank filter values to undefined before delegating', () => {
    renderHook(() => useMyPokemonList());

    const config = usePaginatedListMock.mock.calls[0][0] as {
      normalizeFilters: (filters: { name?: string; pokemon_name?: string }) => {
        name?: string;
        pokemon_name?: string;
      };
    };

    expect(config.normalizeFilters({ name: '  Leaf  ', pokemon_name: '  bulbasaur  ' })).toEqual({
      name: 'Leaf',
      pokemon_name: 'bulbasaur',
    });
    expect(config.normalizeFilters({ name: '   ', pokemon_name: '' })).toEqual({
      name: undefined,
      pokemon_name: undefined,
    });
  });
});
