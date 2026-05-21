'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';

import { battleBffService } from '../service';
import type {
  BattleLog,
  BattleSession,
  BattleSessionStatus,
} from '../types';

const ACTIVE_STATUS: BattleSessionStatus = 'ACTIVE';
const BATTLE_POLLING_INTERVAL_IN_MS = 4000;

type BattleSessionState = {
  data?: BattleSession;
  logs: Array<BattleLog>;
  isLoading: boolean;
  isActing: boolean;
  errorMessage?: string;
};

const initialState: BattleSessionState = {
  data: undefined,
  logs: [],
  isLoading: true,
  isActing: false,
  errorMessage: undefined,
};

const sortBattleLogs = (logs: Array<BattleLog>): Array<BattleLog> => {
  return [...logs].sort((left, right) => {
    const leftTurn = left.turn_number ?? Number.MAX_SAFE_INTEGER;
    const rightTurn = right.turn_number ?? Number.MAX_SAFE_INTEGER;

    if (leftTurn !== rightTurn) {
      return leftTurn - rightTurn;
    }

    const leftDate = new Date(left.created_at).getTime();
    const rightDate = new Date(right.created_at).getTime();
    return leftDate - rightDate;
  });
};

export function useBattleSession() {
  const [state, setState] = useState<BattleSessionState>(initialState);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();
  const didRunInitialLoadRef = useRef(false);
  const isLoadInFlightRef = useRef(false);
  const terminalSnapshotRef = useRef<BattleSession | undefined>(undefined);

  const load = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (isLoadInFlightRef.current) {
      return;
    }

    isLoadInFlightRef.current = true;
    setState((previous) => ({ ...previous, isLoading: !silent, errorMessage: undefined }));

    if (!silent) {
      startContentLoading();
    }

    try {
      const activeResponse = await battleBffService.active();

      if (battleBffService.isResponseError(activeResponse)) {
        if (activeResponse.statusCode === 404) {
          setState((previous) => ({
            ...previous,
            data: terminalSnapshotRef.current ?? undefined,
            logs: terminalSnapshotRef.current ? previous.logs : [],
            isLoading: false,
            isActing: false,
            errorMessage: undefined,
          }));
          return;
        }

        setState((previous) => ({
          ...previous,
          isLoading: false,
          isActing: false,
          errorMessage: activeResponse.message || t('trainer.battle.loadError'),
        }));
        return;
      }

      const logsResponse = await battleBffService.logs();
      const logs = battleBffService.isResponseError(logsResponse)
        ? []
        : sortBattleLogs(logsResponse);
      terminalSnapshotRef.current = activeResponse.status === ACTIVE_STATUS
        ? undefined
        : activeResponse;

      setState((previous) => ({
        ...previous,
        data: activeResponse,
        logs,
        isLoading: false,
        isActing: false,
        errorMessage: battleBffService.isResponseError(logsResponse)
          ? logsResponse.message || t('trainer.battle.logsError')
          : undefined,
      }));
    } catch (error) {
      if (battleBffService.isResponseError(error) && error.statusCode === 404) {
        setState((previous) => ({
          ...previous,
          data: terminalSnapshotRef.current ?? undefined,
          logs: terminalSnapshotRef.current ? previous.logs : [],
          isLoading: false,
          isActing: false,
          errorMessage: undefined,
        }));
        return;
      }

      const message = battleBffService.isResponseError(error)
        ? error.message || t('trainer.battle.loadError')
        : error instanceof Error && error.message
          ? error.message
          : t('trainer.battle.loadError');
      setState((previous) => ({
        ...previous,
        isLoading: false,
        isActing: false,
        errorMessage: message,
      }));
    } finally {
      isLoadInFlightRef.current = false;
      if (!silent) {
        stopContentLoading();
      }
    }
  }, [startContentLoading, stopContentLoading, t]);

  useEffect(() => {
    if (didRunInitialLoadRef.current) {
      return;
    }

    didRunInitialLoadRef.current = true;
    void load();
  }, [load]);

  useEffect(() => {
    if (!state.data || state.data.status !== ACTIVE_STATUS || state.isActing) {
      return;
    }

    const intervalId = globalThis.setInterval(() => {
      void load({ silent: true });
    }, BATTLE_POLLING_INTERVAL_IN_MS);

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [state.data, state.isActing]);

  const syncAfterAction = useCallback(async (fallbackSession: BattleSession) => {
    let nextLogs = state.logs;

    try {
      const logsResponse = await battleBffService.logs();
      nextLogs = battleBffService.isResponseError(logsResponse)
        ? state.logs
        : sortBattleLogs(logsResponse);
    } catch {
      nextLogs = state.logs;
    }

    terminalSnapshotRef.current = fallbackSession.status === ACTIVE_STATUS
      ? undefined
      : fallbackSession;

    setState((previous) => ({
      ...previous,
      data: fallbackSession,
      logs: nextLogs,
      isActing: false,
      errorMessage: undefined,
    }));
  }, [state.logs]);

  const runAction = useCallback(async (
    action: () => Promise<BattleSession | { statusCode: number; message: string }>,
  ) => {
    if (!state.data || state.data.status !== ACTIVE_STATUS) {
      return;
    }

    setState((previous) => ({ ...previous, isActing: true, errorMessage: undefined }));

    try {
      const actionResponse = await action();
      if (battleBffService.isResponseError(actionResponse)) {
        setState((previous) => ({
          ...previous,
          isActing: false,
          errorMessage: actionResponse.message || t('trainer.battle.actionError'),
        }));
        return;
      }

      await syncAfterAction(actionResponse);
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('trainer.battle.actionError');
      setState((previous) => ({
        ...previous,
        isActing: false,
        errorMessage: message,
      }));
    }
  }, [state.data, syncAfterAction, t]);

  const useMove = useCallback(async (moveId: string) => {
    await runAction(async () => await battleBffService.useMove({ move_id: moveId }));
  }, [runAction]);

  const switchPokemon = useCallback(async (myPokemonId: string) => {
    await runAction(async () => await battleBffService.switchPokemon({ my_pokemon_id: myPokemonId }));
  }, [runAction]);

  const flee = useCallback(async () => {
    await runAction(async () => await battleBffService.flee());
  }, [runAction]);

  const isTerminal = useMemo(() => {
    return Boolean(state.data && state.data.status !== ACTIVE_STATUS);
  }, [state.data]);

  return {
    ...state,
    hasActiveBattle: Boolean(state.data),
    isTerminal,
    load,
    useMove,
    switchPokemon,
    flee,
  };
}
