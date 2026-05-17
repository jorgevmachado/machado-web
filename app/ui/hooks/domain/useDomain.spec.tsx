import { renderHook } from '@testing-library/react';

import useDomain from './useDomain';

const startContentLoadingMock = jest.fn();
const stopContentLoadingMock = jest.fn();
const showAlertMock = jest.fn();

jest.mock('@/app/ds', () => ({
  useLoading: () => ({
    isContentLoading: false,
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

describe('useDomain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches one item and list variants successfully', async () => {
    const getOne = jest.fn().mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'common.unknown',
      data: { id: '1', name: 'bulbasaur' },
    });
    const getAll = jest.fn()
      .mockResolvedValueOnce({
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'common.unknown',
        data: [{ id: '1', name: 'bulbasaur' }],
      })
      .mockResolvedValueOnce({
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'common.unknown',
        data: { items: [{ id: '2', name: 'ivysaur' }] },
      })
      .mockResolvedValueOnce({
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'common.unknown',
        data: {
          items: [{ id: '3', name: 'venusaur' }],
          meta: {
            total: 1,
            limit: 12,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 2,
            current_page: 4,
          },
        },
      });

    const { result } = renderHook(() => useDomain<{ id: string; name: string }, { name?: string }>({
      getOne,
      getAll,
    }));

    await expect(result.current.fetchOne('bulbasaur')).resolves.toEqual({ id: '1', name: 'bulbasaur' });
    await expect(result.current.fetchList({}, 12, 'pokemon.list.loadError')).resolves.toEqual([{ id: '1', name: 'bulbasaur' }]);
    await expect(result.current.fetchList({}, 12)).resolves.toEqual([{ id: '2', name: 'ivysaur' }]);
    await expect(result.current.fetchListPaginate(4, {}, 12)).resolves.toEqual({
      items: [{ id: '3', name: 'venusaur' }],
      meta: {
        total: 1,
        limit: 12,
        offset: 0,
        next_page: undefined,
        previous_page: undefined,
        total_pages: 2,
        current_page: 2,
      },
    });

    expect(startContentLoadingMock).toHaveBeenCalledTimes(4);
    expect(stopContentLoadingMock).toHaveBeenCalledTimes(4);
    expect(getAll).toHaveBeenNthCalledWith(1, {}, 1, 12);
    expect(getAll).toHaveBeenNthCalledWith(2, {}, 1, 12);
    expect(getAll).toHaveBeenNthCalledWith(3, {}, 4, 12);
  });

  it('shows translated alerts for response and thrown errors', async () => {
    const getOne = jest.fn()
      .mockResolvedValueOnce({
        error: true,
        status: 500,
        message: 'failed',
        i18nMessage: 'pokemon.detail.loadError',
      })
      .mockRejectedValueOnce(null);
    const getAll = jest.fn()
      .mockResolvedValueOnce({
        error: true,
        status: 500,
        message: 'Explicit list failure',
        i18nMessage: 'pokemon.list.loadError',
      })
      .mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useDomain<{ id: string; name: string }, { name?: string }>({
      getOne,
      getAll,
    }));

    await expect(result.current.fetchOne('missing', 'pokemon.detail.loadError')).resolves.toBeUndefined();
    await expect(result.current.fetchOne('missing', 'pokemon.detail.loadError')).resolves.toBeUndefined();
    await expect(result.current.fetchList({}, 12, 'pokemon.list.loadError')).resolves.toEqual([]);
    await expect(result.current.fetchListPaginate(1, {}, 12, 'pokemon.list.loadError')).resolves.toBeUndefined();

    expect(showAlertMock).toHaveBeenNthCalledWith(1, {
      type: 'error',
      message: 'translated:pokemon.detail.loadError',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(2, {
      type: 'error',
      message: 'translated:pokemon.detail.loadError',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(3, {
      type: 'error',
      message: 'Explicit list failure',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(4, {
      type: 'error',
      message: 'boom',
    });
  });

  it('falls back to translated messages when response messages or thrown errors are missing', async () => {
    const getOne = jest.fn().mockRejectedValue(null);
    const getAll = jest.fn()
      .mockResolvedValueOnce({
        error: true,
        status: 500,
        message: '',
        i18nMessage: 'pokemon.list.loadError',
      })
      .mockResolvedValueOnce({
        error: false,
        status: 200,
        message: 'OK',
        i18nMessage: 'common.unknown',
        data: {},
      });

    const { result } = renderHook(() => useDomain<{ id: string; name: string }, { name?: string }>({
      getOne,
      getAll,
    }));

    await expect(result.current.fetchOne('missing')).resolves.toBeUndefined();
    await expect(result.current.fetchList({}, 12, 'pokemon.list.loadError')).resolves.toEqual([]);
    await expect(result.current.fetchList({}, 12)).resolves.toEqual([]);

    expect(showAlertMock).toHaveBeenNthCalledWith(1, {
      type: 'error',
      message: 'translated:common.unknown',
    });
    expect(showAlertMock).toHaveBeenNthCalledWith(2, {
      type: 'error',
      message: 'translated:pokemon.list.loadError',
    });
  });

  it('handles explicit fetchOne errors and paginated results without items', async () => {
    const getOne = jest.fn().mockRejectedValue(new Error('detail boom'));
    const getAll = jest.fn().mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'common.unknown',
      data: {
        meta: {
          total: 0,
          limit: 12,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 0,
          current_page: 1,
        },
      },
    });

    const { result } = renderHook(() => useDomain<{ id: string; name: string }, { name?: string }>({
      getOne,
      getAll,
    }));

    await expect(result.current.fetchOne('missing')).resolves.toBeUndefined();
    await expect(result.current.fetchList({}, 12)).resolves.toEqual([]);

    expect(showAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: 'detail boom',
    });
  });

  it('uses fetchAll defaults when pagination arguments are omitted', async () => {
    const getOne = jest.fn();
    const getAll = jest.fn().mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage: 'common.unknown',
      data: [],
    });

    const { result } = renderHook(() => useDomain<{ id: string }, { name?: string }>({
      getOne,
      getAll,
    }));

    await expect(result.current.fetchList({})).resolves.toEqual([]);
    await expect(result.current.fetchListPaginate(2, {})).resolves.toEqual([]);

    expect(getAll).toHaveBeenNthCalledWith(1, {}, 1, 12);
    expect(getAll).toHaveBeenNthCalledWith(2, {}, 2, 12);
  });
});
