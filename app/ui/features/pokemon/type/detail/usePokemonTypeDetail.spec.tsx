import { act, renderHook, waitFor } from '@testing-library/react';

import { usePokemonTypeDetail } from './usePokemonTypeDetail';

const showAlertMock = jest.fn();
const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const useAppTranslationMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useAlert: () => ({
    showAlert: showAlertMock,
  }),
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => useAppTranslationMock(),
}));

const createResponse = (json: unknown, ok = true) => ({
  ok,
  json: async () => json,
});

describe('usePokemonTypeDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = jest.fn();
    useAppTranslationMock.mockReturnValue({
      t: (key: string) => `translated:${key}`,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('loads type detail successfully and exposes reload', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockResolvedValueOnce(createResponse({ id: 'type-1', name: 'fire' }) as Response)
      .mockResolvedValueOnce(createResponse({ id: 'type-2', name: 'water' }) as Response);

    const { result } = renderHook(() => usePokemonTypeDetail('fire'));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/pokemon/type/fire', { method: 'GET', cache: 'no-store' });
    expect(result.current.data).toEqual({ id: 'type-1', name: 'fire' });
    expect(result.current.errorMessage).toBeUndefined();
    expect(startContentLoadingMock).toHaveBeenCalledTimes(1);
    expect(stopContentLoadingMock).toHaveBeenCalledTimes(1);
    expect(showAlertMock).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.reload();
    });

    expect(fetchMock).toHaveBeenLastCalledWith('/api/pokemon/type/fire', { method: 'GET', cache: 'no-store' });
    expect(result.current.data).toEqual({ id: 'type-2', name: 'water' });
  });

  it('uses API message when the response is invalid', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockResolvedValueOnce(createResponse({ message: 'Type failed.' }, false) as Response);

    const { result } = renderHook(() => usePokemonTypeDetail('fire'));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Type failed.');
    });

    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Type failed.' });
    expect(stopContentLoadingMock).toHaveBeenCalledTimes(1);
  });

  it('uses translated fallback when the response has no message or when fetch throws', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock
      .mockResolvedValueOnce(createResponse({ unexpected: true }, true) as Response)
      .mockRejectedValueOnce('offline');

    const { result } = renderHook(() => usePokemonTypeDetail('fire'));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('translated:pokemon.type.detail.loadError');
    });

    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'translated:pokemon.type.detail.loadError',
    });

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.errorMessage).toBe('translated:pokemon.type.detail.loadError');
    expect(showAlertMock).toHaveBeenLastCalledWith({
      type: 'error',
      message: 'translated:pokemon.type.detail.loadError',
    });
  });

  it('uses the thrown error message when available and clears the initial timeout on unmount', async () => {
    const fetchMock = global.fetch as jest.Mock;

    fetchMock.mockRejectedValueOnce(new Error('Network down'));

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => usePokemonTypeDetail('fire'));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Network down');
    });

    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'Network down' });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
