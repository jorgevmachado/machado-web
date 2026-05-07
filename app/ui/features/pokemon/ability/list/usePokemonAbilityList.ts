'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonAbilityFilters, PokemonAbilityListItem } from '../types';

const INITIAL_FILTERS: PokemonAbilityFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonAbilityFilters): PokemonAbilityFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonAbilityList() {
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'overgrow' },
    { name: 'order', label: 'Order', type: 'text', value: '', placeholder: '65' },
  ], []);

  return usePaginatedList<PokemonAbilityListItem, PokemonAbilityFilters>({
    endpoint: '/api/pokemon/ability',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: 'Could not load Pokemon abilities.',
    normalizeFilters,
  });
}
