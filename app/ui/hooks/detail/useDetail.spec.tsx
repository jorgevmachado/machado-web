import { act, renderHook, waitFor } from '@testing-library/react';

import useDetailDefault, { useDetail } from './useDetail';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const showAlertMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    startContentLoading: startContentLoadingMock,
    stopContentLoading: stopContentLoadingMock,
  }),
  useAlert: () => ({
    showAlert: showAlertMock,
  }),
}));

jest.mock('@/app/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key === 'missing.translation' ? undefined : `translated:${key}`,
  }),
}));

describe('useDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads detail data on mount and supports manual reload', async () => {
    const fetchDetail = jest.fn().mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'common.unknown',
      data: { id: '1', name: 'bulbasaur' },
    });

    const { result } = renderHook(() => useDetail({
      identifier: 'bulbasaur',
      fetchDetail,
      fetchErrorMessage: 'pokemon.detail.loadError',
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ id: '1', name: 'bulbasaur' });

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.data).toEqual({ id: '1', name: 'bulbasaur' });
    expect(fetchDetail).toHaveBeenCalledWith('bulbasaur');
    expect(startContentLoadingMock).toHaveBeenCalled();
    expect(stopContentLoadingMock).toHaveBeenCalled();
  });

  it('keeps the default export aligned with the named hook export', () => {
    expect(useDetailDefault).toBe(useDetail);
  });

  it('maps service error responses to translated alerts', async () => {
    const fetchDetail = jest.fn().mockResolvedValue({
      error: true,
      status: 500,
      message: 'failed',
      i18nMessage: 'pokemon.detail.loadError',
    });

    const { result } = renderHook(() => useDetail({
      identifier: 'missing',
      fetchDetail,
      fetchErrorMessage: 'pokemon.detail.loadError',
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.errorMessage).toBe('translated:pokemon.detail.loadError');
    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'translated:pokemon.detail.loadError',
    });
  });

  it('uses the default error key when no fetchErrorMessage is provided and the translation is missing', async () => {
    const fetchDetail = jest.fn().mockResolvedValue({
      error: true,
      status: 500,
      message: 'failed',
      i18nMessage: 'missing.translation',
    });

    const { result } = renderHook(() => useDetail({
      identifier: 'missing',
      fetchDetail,
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('translated:common.unknown');
  });

  it('uses the caught error message when the request throws an Error', async () => {
    const fetchDetail = jest.fn().mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useDetail({
      identifier: 'missing',
      fetchDetail,
      fetchErrorMessage: 'pokemon.detail.loadError',
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe('boom');
    expect(showAlertMock).toHaveBeenCalledWith({ type: 'error', message: 'boom' });
  });

  it('uses the translated fallback when the request throws an unknown value', async () => {
    const fetchDetail = jest.fn().mockRejectedValue(null);

    const { result } = renderHook(() => useDetail({
      identifier: 'missing',
      fetchDetail,
      fetchErrorMessage: 'pokemon.detail.loadError',
    }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.errorMessage).toBe('translated:pokemon.detail.loadError');
    expect(showAlertMock).toHaveBeenLastCalledWith({
      type: 'error',
      message: 'translated:pokemon.detail.loadError',
    });
  });
});
