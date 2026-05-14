import { act, renderHook, waitFor } from '@testing-library/react';

import { useMyPokemonDetail } from './useMyPokemonDetail';

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

describe('useMyPokemonDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads detail data successfully', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: '1', name: 'bulbasaur' }),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('bulbasaur'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/my-pokemon/bulbasaur', expect.objectContaining({
      method: 'GET',
      cache: 'no-store',
    }));
    expect(result.current.data?.name).toBe('bulbasaur');
  });

  it('reports a load error when the response is invalid', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: false,
      json: async () => ({ message: 'Could not load' }),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('missing'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Could not load');
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Could not load' });
  });

  it('uses the translated error when the response is invalid without a message', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: false,
      json: async () => ({}),
    }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('missing'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('myPokemon.detail.loadError');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'myPokemon.detail.loadError',
    });
  });

  it('falls back to the translated error when the request throws without a message', async () => {
    const fetchMock = jest.fn(async () => {
      throw '';
    });
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('missing'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('myPokemon.detail.loadError');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'myPokemon.detail.loadError',
    });
  });

  it('uses the thrown error message when fetch rejects with an Error instance', async () => {
    const fetchMock = jest.fn(async () => {
      throw new Error('Network unavailable');
    });
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('missing'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('Network unavailable');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'Network unavailable',
    });
  });

  it('reloads detail data on demand', async () => {
    const fetchMock = jest.fn()
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ id: '1', name: 'bulbasaur' }),
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ id: '1', name: 'ivysaur' }),
      }));
    global.fetch = fetchMock as never;

    const { result } = renderHook(() => useMyPokemonDetail('bulbasaur'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(result.current.data?.name).toBe('bulbasaur');
    });

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.data?.name).toBe('ivysaur');
    });
  });
});
