'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAlert, useLoading } from '@/app/ds';

import type { PokemonTypeDetail } from '../types';

type PokemonTypeDetailState = {
  data?: PokemonTypeDetail;
  isLoading: boolean;
  errorMessage?: string;
};

export function usePokemonTypeDetail(identifier: string) {
  const [state, setState] = useState<PokemonTypeDetailState>({
    data: undefined,
    isLoading: true,
    errorMessage: undefined,
  });
  const { startContentLoading, stopContentLoading } = useLoading();
  const { showAlert } = useAlert();

  const load = useCallback(async () => {
    setState((previousState) => ({ ...previousState, isLoading: true, errorMessage: undefined }));
    startContentLoading();

    try {
      const response = await fetch(`/api/pokemon/type/${identifier}`, { method: 'GET', cache: 'no-store' });
      const json = await response.json() as PokemonTypeDetail | { message?: string };

      if (!response.ok || !('id' in json)) {
        const message = 'message' in json && json.message ? json.message : 'Could not load Pokemon type detail.';
        setState({ data: undefined, isLoading: false, errorMessage: message });
        showAlert({ type: 'error', message });
        return;
      }

      setState({ data: json, isLoading: false, errorMessage: undefined });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : 'Could not load Pokemon type detail.';
      setState({ data: undefined, isLoading: false, errorMessage: message });
      showAlert({ type: 'error', message });
    } finally {
      stopContentLoading();
    }
  }, [identifier, showAlert, startContentLoading, stopContentLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [load]);

  return { ...state, reload: load };
}
