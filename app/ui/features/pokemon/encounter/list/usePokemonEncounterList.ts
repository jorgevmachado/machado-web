'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonEncounterFilters, TPokemonEncounter } from '../types';

const INITIAL_FILTERS: PokemonEncounterFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonEncounterFilters): PokemonEncounterFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonEncounterList() {
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'tackle' },
    { name: 'order', label: 'Order', type: 'text', value: '', placeholder: '33' },
  ], []);

  return usePaginatedList<TPokemonEncounter, PokemonEncounterFilters>({
    endpoint: '/api/pokemon/encounter',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: 'Could not load Pokemon encounters.',
    normalizeFilters,
  });
}
