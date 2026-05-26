'use client';

import { useCallback, useEffect, useState } from 'react';

import { useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import type {
  TPokemonCenterHealingResult,
  TPokemonCenterHistoryEntry,
  TTrainerHome,
} from '@/app/ui/features/trainer/types';

type PokemonCenterState = {
  home?: TTrainerHome;
  history: Array<TPokemonCenterHistoryEntry>;
  isLoading: boolean;
  isHealing: boolean;
  errorMessage?: string;
  lastResult?: TPokemonCenterHealingResult;
};

const initialState: PokemonCenterState = {
  home: undefined,
  history: [],
  isLoading: true,
  isHealing: false,
  errorMessage: undefined,
  lastResult: undefined,
};

export function usePokemonCenter() {
  const [state, setState] = useState<PokemonCenterState>(initialState);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, isLoading: true, errorMessage: undefined }));
    startContentLoading();

    try {
      const [homeResponse, historyResponse] = await Promise.all([
        fetch('/api/trainer/home', { method: 'GET', cache: 'no-store' }),
        fetch('/api/trainer/pokemon-center/healing-history?limit=20', {
          method: 'GET',
          cache: 'no-store',
        }),
      ]);

      const homeJson = await homeResponse.json() as TTrainerHome | { message?: string };
      const historyJson = await historyResponse.json() as
        | { items?: Array<TPokemonCenterHistoryEntry>; message?: string }
        | Array<TPokemonCenterHistoryEntry>;

      if (!homeResponse.ok || !('trainer' in homeJson)) {
        const message = 'message' in homeJson && homeJson.message
          ? homeJson.message
          : t('pokemonCenter.loadError');
        setState((previous) => ({ ...previous, isLoading: false, errorMessage: message }));
        return;
      }

      const history = Array.isArray(historyJson)
        ? historyJson
        : Array.isArray(historyJson.items)
          ? historyJson.items
          : [];

      if (!historyResponse.ok) {
        const message = !Array.isArray(historyJson) && historyJson.message
          ? historyJson.message
          : t('pokemonCenter.historyLoadError');
        setState((previous) => ({
          ...previous,
          home: homeJson,
          history: [],
          isLoading: false,
          errorMessage: message,
        }));
        return;
      }

      setState((previous) => ({
        ...previous,
        home: homeJson,
        history,
        isLoading: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : t('pokemonCenter.loadError');
      setState((previous) => ({ ...previous, isLoading: false, errorMessage: message }));
    } finally {
      stopContentLoading();
    }
  }, [startContentLoading, stopContentLoading, t]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [load]);

  const heal = useCallback(async () => {
    setState((previous) => ({ ...previous, isHealing: true, errorMessage: undefined }));

    try {
      const response = await fetch('/api/trainer/pokemon-center/heal', {
        method: 'POST',
        cache: 'no-store',
      });
      const json = await response.json() as TPokemonCenterHealingResult | { message?: string };

      if (!response.ok || !('success' in json)) {
        const message = 'message' in json && json.message
          ? json.message
          : t('pokemonCenter.healError');
        setState((previous) => ({ ...previous, isHealing: false, errorMessage: message }));
        return undefined;
      }

      setState((previous) => ({
        ...previous,
        isHealing: false,
        lastResult: json,
        errorMessage: undefined,
      }));
      await load();
      return json;
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : t('pokemonCenter.healError');
      setState((previous) => ({ ...previous, isHealing: false, errorMessage: message }));
      return undefined;
    }
  }, [load, t]);

  return {
    ...state,
    load,
    heal,
  };
}
