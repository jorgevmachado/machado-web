import { renderHook } from '@testing-library/react';

import { usePokemonTypeDetail } from './usePokemonTypeDetail';

const useDetailMock = jest.fn();

jest.mock('@/app/ui/hooks/detail', () => ({
  useDetail: (...args: unknown[]) => useDetailMock(...args),
}));

jest.mock('../services', () => ({
  pokemonTypeBffService: {
    fetchOne: jest.fn(),
  },
}));

describe('usePokemonTypeDetail', () => {
  it('delegates to the shared detail hook with feature configuration', () => {
    useDetailMock.mockReturnValue({ data: undefined, isLoading: false, errorMessage: undefined, reload: jest.fn() });

    renderHook(() => usePokemonTypeDetail('fire'));

    expect(useDetailMock).toHaveBeenCalledWith(expect.objectContaining({
      identifier: 'fire',
      fetchErrorMessage: 'pokemon.type.detail.loadError',
      fetchDetail: expect.any(Function),
    }));
  });
});
