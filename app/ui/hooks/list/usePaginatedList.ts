'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type FiltersProps, type TPaginatedListResponse, type TPaginatedMeta, useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { BffListResponse } from '@/app/shared';
import { buildQueryString } from '@/app/utils';

const INITIAL_PAGINATION: TPaginatedMeta = {
  total: 0,
  limit: 10,
  offset: 0,
  next_page: undefined,
  previous_page: undefined,
  total_pages: 0,
  current_page: 1,
};

type ListFilterValueMap = Record<string, string | undefined>;

type PaginatedListState<TItem> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
};

type FetchListFn<TItem, TFilters> = (
  filters: TFilters,
  page: number,
  perPage?: number,
) => Promise<BffListResponse<TItem>>;

type UsePaginatedListParams<TItem, TFilters> = {
  fetchList?: FetchListFn<TItem, TFilters>;
  endpoint?: string;
  initialFilters: TFilters;
  initialInputFilters: FiltersProps['filters'];
  fetchErrorMessage: string;
  normalizeFilters: (nextFilters: TFilters) => TFilters;
  buildQueryString?: (page: number, limit: number, filters: TFilters) => string;
};

type UsePaginatedListResult<TItem, TFilters> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
  filters: TFilters;
  inputFilters: FiltersProps['filters'];
  goToPage: (page: number) => void;
  applyFilters: (nextFilters: TFilters) => void;
  applyInputFilters: (nextFilters: TFilters) => void;
  clearFilters: () => void;
  clearInputFilters: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
  reload: () => void;
};

const createInitialState = <TItem,>(): PaginatedListState<TItem> => ({
  items: [],
  meta: INITIAL_PAGINATION,
  isLoading: true,
  errorMessage: undefined,
});

const clampPage = (page: number, totalPages: number): number => {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
};

const buildInputFilterValueMap = (filters: FiltersProps['filters']): Record<string, string> => {
  return Object.fromEntries(
    filters.map((filter) => [filter.name, filter.value]),
  );
};

const usePaginatedList = <TItem, TFilters>({
  fetchList,
  endpoint,
  initialFilters,
  initialInputFilters,
  fetchErrorMessage,
  normalizeFilters,
  buildQueryString: buildQueryStringOverride,
}: UsePaginatedListParams<TItem, TFilters>): UsePaginatedListResult<TItem, TFilters> => {
  const [state, setState] = useState<PaginatedListState<TItem>>(() => createInitialState<TItem>());
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [inputFilterValues, setInputFilterValues] = useState<Record<string, string>>(() => buildInputFilterValueMap(initialInputFilters));
  const requestIdRef = useRef(0);
  const fetchListRef = useRef(fetchList);
  const endpointRef = useRef(endpoint);
  const buildQueryStringRef = useRef(buildQueryStringOverride);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  useEffect(() => {
    fetchListRef.current = fetchList;
    endpointRef.current = endpoint;
    buildQueryStringRef.current = buildQueryStringOverride;
  }, [buildQueryStringOverride, endpoint, fetchList]);

  const inputFilters = useMemo<FiltersProps['filters']>(() => {
    return initialInputFilters.map((filter) => ({
      ...filter,
      value: inputFilterValues[filter.name] ?? '',
    }));
  }, [initialInputFilters, inputFilterValues]);

  const fetchPage = useCallback(async (page: number, activeFilters: TFilters, perPage: number = 12): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const loadList = fetchListRef.current;
      let response: BffListResponse<TItem>;

      if (loadList) {
        response = await loadList(activeFilters, page, perPage);
      } else {
        const currentEndpoint = endpointRef.current;

        if (!currentEndpoint) {
          throw new Error('usePaginatedList requires either fetchList or endpoint.');
        }

        const queryString = buildQueryStringRef.current
          ? buildQueryStringRef.current(page, perPage, activeFilters)
          : buildQueryString(activeFilters, page, perPage);
        const path = queryString === '' ? currentEndpoint : `${currentEndpoint}?${queryString}`;
        const fetchResponse = await fetch(path, {
          method: 'GET',
          cache: 'no-store',
        });
        const json = await fetchResponse.json() as TPaginatedListResponse<TItem> | { message?: string };

        response = !fetchResponse.ok || !('items' in json)
          ? {
            error: true,
            status: fetchResponse.status,
            message: 'message' in json && json.message ? json.message : fetchErrorMessage,
            i18nMessage: fetchErrorMessage,
          }
          : {
            error: false,
            status: fetchResponse.status,
            message: 'OK',
            i18nMessage: fetchErrorMessage,
            data: json,
          };
      }

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (response.error && !response?.data) {
        const message = response.message || t(response.i18nMessage);
        setState((previousState) => ({
          ...previousState,
          isLoading: false,
          errorMessage: message ?? fetchErrorMessage,
        }));
        return;
      }
      const data = response.data as TPaginatedListResponse<TItem>;
      const normalizedPage = clampPage(data.meta.current_page, data.meta.total_pages);

      setState({
        items: data.items,
        meta: {
          ...data.meta,
          current_page: normalizedPage,
        },
        isLoading: false,
        errorMessage: undefined,
      });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error && error.message ? error.message : fetchErrorMessage;

      setState((previousState) => ({
        ...previousState,
        isLoading: false,
        errorMessage,
      }));
    } finally {
      stopContentLoading();
    }
  }, [fetchErrorMessage, stopContentLoading, t]);

  const requestPage = useCallback((page: number, activeFilters: TFilters, perPage: number = 12): void => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    void fetchPage(page, activeFilters, perPage);
  }, [fetchPage, startContentLoading]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      startContentLoading();
      void fetchPage(1, initialFilters);
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [fetchPage, initialFilters, startContentLoading]);

  const goToPage = useCallback((page: number) => {
    const targetPage = clampPage(page, state.meta.total_pages);

    if (targetPage === state.meta.current_page || state.isLoading) {
      return;
    }

    requestPage(targetPage, filters);
  }, [filters, requestPage, state.isLoading, state.meta.current_page, state.meta.total_pages]);

  const applyFilters = useCallback((nextFilters: TFilters) => {
    const normalizedFilters = normalizeFilters(nextFilters);

    setFilters(normalizedFilters);
    requestPage(1, normalizedFilters);
  }, [normalizeFilters, requestPage]);

  const applyInputFilters = useCallback((nextFilters: TFilters) => {
    const filterValues = nextFilters as ListFilterValueMap;
    setInputFilterValues((previousState) => {
      const nextState = { ...previousState };

      for (const key of Object.keys(nextState)) {
        nextState[key] = filterValues[key] || '';
      }

      return nextState;
    });

    applyFilters(nextFilters);
  }, [applyFilters]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    requestPage(1, initialFilters);
  }, [initialFilters, requestPage]);

  const clearInputFilters = useCallback(() => {
    setInputFilterValues((previousState) => {
      return Object.fromEntries(
        Object.keys(previousState).map((key) => [key, '']),
      );
    });

    clearFilters();
  }, [clearFilters]);

  const updateInputFilters = useCallback((nextInputFilters: FiltersProps['filters']) => {
    setInputFilterValues(buildInputFilterValueMap(nextInputFilters));
  }, []);

  const reload = useCallback(() => {
    requestPage(state.meta.current_page, filters);
  }, [filters, requestPage, state.meta.current_page]);

  return {
    items: state.items,
    meta: state.meta,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    filters,
    inputFilters,
    goToPage,
    applyFilters,
    applyInputFilters,
    clearFilters,
    clearInputFilters,
    updateInputFilters,
    reload,
  };
};

export default usePaginatedList;
