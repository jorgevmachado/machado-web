'use client';

import { useCallback, useEffect, useState } from 'react';

import { useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

import type {
  TBattleLog,
  TBattleSession,
} from '../types';

type TrainerBattleState = {
  data?: TBattleSession;
  logs: Array<TBattleLog>;
  isLoading: boolean;
  isActing: boolean;
  errorMessage?: string;
};

const initialState: TrainerBattleState = {
  data: undefined,
  logs: [],
  isLoading: true,
  isActing: false,
  errorMessage: undefined,
};

export function useTrainerBattle() {
  const [state, setState] = useState<TrainerBattleState>(initialState);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, isLoading: true, errorMessage: undefined }));
    startContentLoading();

    try {
      const [battleResponse, logsResponse] = await Promise.all([
        fetch('/api/trainer/battle/active', { method: 'GET', cache: 'no-store' }),
        fetch('/api/trainer/battle/logs', { method: 'GET', cache: 'no-store' }),
      ]);
      const battleJson = await battleResponse.json() as TBattleSession | { message?: string };
      const logsJson = await logsResponse.json() as Array<TBattleLog> | { message?: string };

      if (
        !battleResponse.ok
        || !logsResponse.ok
        || !('id' in battleJson)
        || !Array.isArray(logsJson)
      ) {
        const message = ('message' in battleJson && battleJson.message)
          || ('message' in logsJson && logsJson.message)
          || t('trainer.battle.loadError');
        setState((previous) => ({ ...previous, isLoading: false, errorMessage: message }));
        return;
      }

      setState({
        data: battleJson,
        logs: logsJson,
        isLoading: false,
        isActing: false,
        errorMessage: undefined,
      });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('trainer.battle.loadError');
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

  const runBattleAction = useCallback(async (
    path: string,
    payload?: Record<string, string>,
  ) => {
    setState((previous) => ({ ...previous, isActing: true, errorMessage: undefined }));

    try {
      const response = await fetch(path, {
        method: 'POST',
        cache: 'no-store',
        headers: payload ? { 'content-type': 'application/json; charset=UTF-8' } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const json = await response.json() as TBattleSession | { message?: string };

      if (!response.ok || !('id' in json)) {
        const message = 'message' in json && json.message ? json.message : t('trainer.battle.actionError');
        setState((previous) => ({ ...previous, isActing: false, errorMessage: message }));
        return;
      }

      const logsResponse = await fetch('/api/trainer/battle/logs', {
        method: 'GET',
        cache: 'no-store',
      });
      const logsJson = await logsResponse.json() as Array<TBattleLog> | { message?: string };

      setState((previous) => ({
        ...previous,
        data: json,
        logs: Array.isArray(logsJson) ? logsJson : previous.logs,
        isActing: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('trainer.battle.actionError');
      setState((previous) => ({ ...previous, isActing: false, errorMessage: message }));
    }
  }, [t]);

  const useMove = useCallback(async (moveId: string) => {
    await runBattleAction('/api/trainer/battle/move', { move_id: moveId });
  }, [runBattleAction]);

  const switchPokemon = useCallback(async (myPokemonId: string) => {
    await runBattleAction('/api/trainer/battle/switch', { my_pokemon_id: myPokemonId });
  }, [runBattleAction]);

  const flee = useCallback(async () => {
    await runBattleAction('/api/trainer/battle/flee');
  }, [runBattleAction]);

  return {
    ...state,
    load,
    useMove,
    switchPokemon,
    flee,
  };
}
