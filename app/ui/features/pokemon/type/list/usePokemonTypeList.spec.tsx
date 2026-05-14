import { renderHook } from '@testing-library/react';

import { usePokemonTypeList } from './usePokemonTypeList';

const usePaginatedListMock = jest.fn();
const useAppTranslationMock = jest.fn();

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => useAppTranslationMock(),
}));

jest.mock('@/app/ui/hooks/list/usePaginatedList', () => ({
  __esModule: true,
  default: function usePaginatedList(params: unknown) {
    return usePaginatedListMock(params);
  },
}));

describe('usePokemonTypeList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppTranslationMock.mockReturnValue({
      t: (key: string) => `translated:${key}`,
    });
    usePaginatedListMock.mockReturnValue({ items: [], meta: { total: 0 } });
  });

  it('builds translated filters and forwards configuration to usePaginatedList', () => {
    const { result } = renderHook(() => usePokemonTypeList());

    expect(result.current).toEqual({ items: [], meta: { total: 0 } });
    expect(usePaginatedListMock).toHaveBeenCalledTimes(1);

    const params = usePaginatedListMock.mock.calls[0][0] as {
      endpoint: string;
      initialFilters: { name?: string; order?: string };
      initialInputFilters: Array<{ name: string; label: string; placeholder: string; value: string }>;
      fetchErrorMessage: string;
      normalizeFilters: (filters: { name?: string; order?: string }) => { name?: string; order?: string };
    };

    expect(params.endpoint).toBe('/api/pokemon/type');
    expect(params.initialFilters).toEqual({ name: undefined, order: undefined });
    expect(params.initialInputFilters).toEqual([
      { name: 'name', label: 'translated:filters.name', type: 'text', value: '', placeholder: 'fire' },
      { name: 'order', label: 'translated:filters.order', type: 'text', value: '', placeholder: '10' },
    ]);
    expect(params.fetchErrorMessage).toBe('translated:pokemon.type.list.loadError');
    expect(params.normalizeFilters({ name: ' fire ', order: ' 10 ' })).toEqual({ name: 'fire', order: '10' });
    expect(params.normalizeFilters({ name: ' ', order: '' })).toEqual({ name: undefined, order: undefined });
  });
});
