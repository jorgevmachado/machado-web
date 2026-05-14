import { act, renderHook, waitFor } from '@testing-library/react';

import { usePokedexDetail } from './usePokedexDetail';

const showAlertMock = jest.fn();
const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const translateMock = (key: string) => key;

jest.mock('@/app/ds', () => ({
  useAlert: () => ({ showAlert: showAlertMock }),
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

describe('usePokedexDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads detail data successfully', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: '1', pokemon: { name: 'bulbasaur' } }),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('bulbasaur'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/pokedex/bulbasaur', expect.objectContaining({
      method: 'GET',
      cache: 'no-store',
    }));
    expect(result.current.data?.pokemon.name).toBe('bulbasaur');
  });

  it('reports a load error when the response is invalid', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: false,
      json: async () => ({ message: 'Could not load' }),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('missing'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Could not load');
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load' });
  });

  it('uses the translated fallback when the invalid response has no message', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: false,
      json: async () => ({}),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('missing'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('pokedex.detail.loadError');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'pokedex.detail.loadError',
    });
  });

  it('reloads detail data on demand', async () => {
    const fetchMock = jest.fn()
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ id: '1', pokemon: { name: 'bulbasaur' } }),
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ id: '1', pokemon: { name: 'ivysaur' } }),
      }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('bulbasaur'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(result.current.data?.pokemon.name).toBe('bulbasaur');
    });

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.data?.pokemon.name).toBe('ivysaur');
    });
  });

  it('uses the fallback message when fetch throws a non-Error value', async () => {
    const fetchMock = jest.fn(async () => {
      throw undefined;
    });
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('bulbasaur'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('pokedex.detail.loadError');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'pokedex.detail.loadError',
    });
  });

  it('uses the thrown Error message when fetch rejects with an Error', async () => {
    const fetchMock = jest.fn(async () => {
      throw new Error('Network exploded');
    });
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => usePokedexDetail('bulbasaur'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Network exploded');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Network exploded',
    });
  });
});
