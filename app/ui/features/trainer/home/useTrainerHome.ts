'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLoading } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import type { TMyPokemon } from '@/app/ui';

import type {
  TExplorationEvent,
  TTrainerEncounter,
  TTrainerHome,
} from '../types';

type TrainerHomeState = {
  data?: TTrainerHome;
  encounters: Array<TTrainerEncounter>;
  roster: Array<TMyPokemon>;
  partySelection: Array<string>;
  lastEvent?: TExplorationEvent;
  isLoading: boolean;
  isSavingParty: boolean;
  isWalking: boolean;
  isUpdatingEncounter: boolean;
  errorMessage?: string;
};

const initialState: TrainerHomeState = {
  data: undefined,
  encounters: [],
  roster: [],
  partySelection: [],
  lastEvent: undefined,
  isLoading: true,
  isSavingParty: false,
  isWalking: false,
  isUpdatingEncounter: false,
  errorMessage: undefined,
};

export function useTrainerHome() {
  const [state, setState] = useState<TrainerHomeState>(initialState);
  const { startContentLoading, stopContentLoading } = useLoading();
  const { t } = useAppTranslation();

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, isLoading: true, errorMessage: undefined }));
    startContentLoading();

    try {
      const [homeResponse, encountersResponse, rosterResponse] = await Promise.all([
        fetch('/api/trainer/home', { method: 'GET', cache: 'no-store' }),
        fetch('/api/trainer/encounters', { method: 'GET', cache: 'no-store' }),
        fetch('/api/my-pokemon?page=1&limit=100', { method: 'GET', cache: 'no-store' }),
      ]);

      const homeJson = await homeResponse.json() as TTrainerHome | { message?: string };
      const encountersJson = await encountersResponse.json() as Array<TTrainerEncounter> | { message?: string };
      const rosterJson = await rosterResponse.json() as { items?: Array<TMyPokemon>; message?: string };

      if (
        !homeResponse.ok
        || !encountersResponse.ok
        || !rosterResponse.ok
        || !('trainer' in homeJson)
        || !Array.isArray(encountersJson)
        || !Array.isArray(rosterJson.items)
      ) {
        const message = ('message' in homeJson && homeJson.message)
          || ('message' in encountersJson && encountersJson.message)
          || rosterJson.message
          || t('home.dashboard.loadError');
        setState((previous) => ({ ...previous, isLoading: false, errorMessage: message }));
        return;
      }

      setState((previous) => ({
        data: homeJson,
        encounters: encountersJson,
        roster: rosterJson.items,
        partySelection: homeJson.party.map((member) => member.my_pokemon.id),
        lastEvent: previous.lastEvent,
        isLoading: false,
        isSavingParty: false,
        isWalking: false,
        isUpdatingEncounter: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('home.dashboard.loadError');
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

  const selectEncounter = useCallback(async (encounterId: string) => {
    setState((previous) => ({ ...previous, isUpdatingEncounter: true, errorMessage: undefined }));

    try {
      const response = await fetch('/api/trainer/encounters/active', {
        method: 'PUT',
        cache: 'no-store',
        headers: { 'content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ encounter_id: encounterId }),
      });
      const json = await response.json() as TTrainerEncounter | { message?: string };

      if (!response.ok || !('id' in json)) {
        const message = 'message' in json && json.message ? json.message : t('home.dashboard.encounterSelectError');
        setState((previous) => ({ ...previous, isUpdatingEncounter: false, errorMessage: message }));
        return;
      }

      setState((previous) => ({
        ...previous,
        data: { ...previous.data!, active_encounter: json },
        encounters: previous.encounters.map((encounter) => ({
          ...encounter,
          is_active: encounter.id === json.id,
        })),
        isUpdatingEncounter: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('home.dashboard.encounterSelectError');
      setState((previous) => ({ ...previous, isUpdatingEncounter: false, errorMessage: message }));
    }
  }, [t]);

  const walk = useCallback(async () => {
    setState((previous) => ({ ...previous, isWalking: true, errorMessage: undefined }));

    try {
      const response = await fetch('/api/trainer/walk', {
        method: 'POST',
        cache: 'no-store',
      });
      const json = await response.json() as TExplorationEvent | { message?: string };

      if (!response.ok || !('id' in json)) {
        const message = 'message' in json && json.message ? json.message : t('home.dashboard.walkError');
        setState((previous) => ({ ...previous, isWalking: false, errorMessage: message }));
        return;
      }

      setState((previous) => ({
        ...previous,
        data: {
          ...previous.data,
          trainer: {
            ...previous.data.trainer,
            pokeballs: json.trainer_pokeballs ?? previous.data.trainer.pokeballs,
          },
        },
        lastEvent: json,
        isWalking: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('home.dashboard.walkError');
      setState((previous) => ({ ...previous, isWalking: false, errorMessage: message }));
    }
  }, [t]);

  const togglePartySelection = useCallback((myPokemonId: string) => {
    setState((previous) => {
      const alreadySelected = previous.partySelection.includes(myPokemonId);
      if (alreadySelected) {
        return {
          ...previous,
          partySelection: previous.partySelection.filter((item) => item !== myPokemonId),
        };
      }
      if (previous.partySelection.length >= 6) {
        return previous;
      }
      return {
        ...previous,
        partySelection: [...previous.partySelection, myPokemonId],
      };
    });
  }, []);

  const saveParty = useCallback(async () => {
    setState((previous) => ({ ...previous, isSavingParty: true, errorMessage: undefined }));

    try {
      const response = await fetch('/api/trainer/party', {
        method: 'PUT',
        cache: 'no-store',
        headers: { 'content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ my_pokemon_ids: state.partySelection }),
      });
      const json = await response.json() as Array<TTrainerHome['party'][number]> | { message?: string };

      if (!response.ok || !Array.isArray(json)) {
        const message = !Array.isArray(json) && json.message ? json.message : t('home.dashboard.partySaveError');
        setState((previous) => ({ ...previous, isSavingParty: false, errorMessage: message }));
        return;
      }

      setState((previous) => ({
        ...previous,
        data: { ...previous.data!, party: json },
        partySelection: json.map((item) => item.my_pokemon.id),
        isSavingParty: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : t('home.dashboard.partySaveError');
      setState((previous) => ({ ...previous, isSavingParty: false, errorMessage: message }));
    }
  }, [state.partySelection, t]);

  const activeEncounter = useMemo(() => {
    return state.data?.active_encounter ?? state.encounters.find((encounter) => encounter.is_active);
  }, [state.data?.active_encounter, state.encounters]);

  return {
    ...state,
    activeEncounter,
    load,
    selectEncounter,
    walk,
    togglePartySelection,
    saveParty,
  };
}
