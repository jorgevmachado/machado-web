import { useCallback, useEffect, useState } from 'react';

import { useAlert, useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

import { BffResponse } from '@/app/shared';

type DetailState<TItem> = {
  data?: TItem;
  isLoading: boolean;
  errorMessage?: string;
};

type FetchDetailFn<TItem> = (identifier: string) => Promise<BffResponse<TItem>>;

type UseDetailParams<TItem> = {
  identifier: string;
  fetchDetail: FetchDetailFn<TItem>;
  fetchErrorMessage?: string;
};

type UseDetailResult<TItem> = DetailState<TItem> & {
  reload: () => Promise<void>;
};

export function useDetail<TItem>({
  identifier,
  fetchDetail,
  fetchErrorMessage = 'common.unknown'
}: UseDetailParams<TItem>): UseDetailResult<TItem> {
  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const [state, setState] = useState<DetailState<TItem>>({
    data: undefined,
    isLoading: true,
    errorMessage: undefined,
  });

  const load = useCallback(async () => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    const tFetchErrorMessage = t(fetchErrorMessage);
    try {
      const response = await fetchDetail(identifier);
      if (response.error && !response?.data) {
        const message = t(response.i18nMessage);
        setState({ data: undefined, isLoading: false, errorMessage: message ?? tFetchErrorMessage });
        showAlert({ type: 'error', message });
        return;
      }
      setState({ data: response.data, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : tFetchErrorMessage;
      setState({ data: undefined, isLoading: false, errorMessage: message });
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [fetchDetail, fetchErrorMessage, identifier, showAlert, startContentLoading, stopContentLoading, t]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [load]);

  return {
    ...state,
    reload: load
  };
}

export default useDetail;
