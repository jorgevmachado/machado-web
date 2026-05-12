'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAlert, useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

import type { TPokemon } from '../types';

type PokemonDetailState = {
  data?: TPokemon;
  isLoading: boolean;
  errorMessage?: string;
};

export function usePokemonDetail(identifier: string) {
  const [state, setState] = useState<PokemonDetailState>({
    data: undefined,
    isLoading: true,
    errorMessage: undefined,
  });
  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();
  const { t } = useAppTranslation();

  const load = useCallback(async () => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();

    try {
      const response = await fetch(`/api/pokemon/${identifier}`, {
        method: 'GET',
        cache: 'no-store',
      });
      const json = await response.json() as TPokemon | { message?: string; error?: string };

      if (!response.ok || !('id' in json)) {
        const message = 'message' in json && json.message ? json.message : t('pokemon.detail.loadError');
        setState({ data: undefined, isLoading: false, errorMessage: message });
        showAlert({ type: 'error', message });
        return;
      }

      setState({ data: json, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('pokemon.detail.loadError');
      setState({ data: undefined, isLoading: false, errorMessage: message });
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [identifier, showAlert, startContentLoading, stopContentLoading, t]);

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
    reload: load,
  };
}
