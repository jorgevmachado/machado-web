import { TPaginatedListResponse, useAlert, useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import { useCallback } from 'react';
import { clampPage } from '@/app/utils';
import { ShowAlertInput } from '@/app/ds/alert';
import { BffDetailResponse ,BffListResponse } from '@/app/shared';

type UseDomainResult<TItem, TFilters> = {
  fetchOne: (identifier: string, fetchErrorMessage?: string) => Promise<TItem | undefined>;
  fetchList: (filters: TFilters, perPage?: number, fetchErrorMessage?: string) => Promise<Array<TItem>>;
  showAlert: (input: ShowAlertInput) => string;
  isContentLoading: boolean;
  fetchListPaginate: (page: number, filters: TFilters, perPage?: number, fetchErrorMessage?: string) => Promise<TPaginatedListResponse<TItem> | undefined>;
  stopContentLoading: () => void;
  startContentLoading: () => void;
};

type UseDomainParams<TItem, TFilters> = {
  getOne: (identifier: string) => Promise<BffDetailResponse<TItem>>;
  getAll: (filters: TFilters, page?: number, perPage?: number) => Promise<BffListResponse<TItem>>;
};

const useDomain = <TItem, TFilters>({
  getOne,
  getAll
}: UseDomainParams<TItem, TFilters>): UseDomainResult<TItem, TFilters> => {
  const { isContentLoading, startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const fetchOne = useCallback(async (identifier: string, fetchErrorMessage: string = 'common.unknown'): Promise<TItem | undefined> => {
    startContentLoading();
    const errorMessage = t(fetchErrorMessage);
    try {
      const response = await getOne(identifier);
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      return response.data;
    } catch (error) {
      console.log('# => error => ', error);
      const message = error instanceof Error && error.message ? error.message : errorMessage;
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [getOne, showAlert, startContentLoading, stopContentLoading, t]);

  const fetchAll = useCallback(async (filters: TFilters, page?: number, perPage: number = 12, fetchErrorMessage: string = 'common.unknown') => {
    startContentLoading();
    const errorMessage = t(fetchErrorMessage);
    try {
      const response = await getAll(filters, page, perPage);
      if (response.error && !response?.data) {
        const message = response.message || t(response.i18nMessage);
        showAlert({ type: 'error', message });
        return;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }

      const data = response.data as Partial<TPaginatedListResponse<TItem>> & {
        items?: Array<TItem>;
      };

      if (!data.meta) {
        return data.items ?? [];
      }

      const normalizedPage = clampPage(data.meta.current_page, data.meta.total_pages);

      return {
        ...data,
        meta: {
          ...data.meta,
          current_page: normalizedPage
        }
      };
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : errorMessage;
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [getAll, showAlert, startContentLoading, stopContentLoading, t]);

  const fetchList = useCallback(async (filters: TFilters, perPage?: number, fetchErrorMessage?: string): Promise<Array<TItem>> => {
    const response = await fetchAll(filters, 1, perPage, fetchErrorMessage);

    if (!response) {
      return [];
    }

    return Array.isArray(response) ? response : response.items ?? [];
  }, [fetchAll]);

  const fetchListPaginate = useCallback(async (page: number, filters: TFilters, perPage?: number, fetchErrorMessage?: string) => {
    return await fetchAll(filters, page, perPage, fetchErrorMessage) as TPaginatedListResponse<TItem> | undefined;
  }, [fetchAll]);

  return {
    fetchOne,
    fetchList,
    showAlert,
    isContentLoading,
    fetchListPaginate,
    stopContentLoading,
    startContentLoading
  };
};

export default useDomain;
