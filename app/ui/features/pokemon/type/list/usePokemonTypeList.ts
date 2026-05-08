'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonTypeFilters, TPokemonType } from '../types';

const INITIAL_FILTERS: PokemonTypeFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonTypeFilters): PokemonTypeFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonTypeList() {
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'fire' },
    { name: 'order', label: 'Order', type: 'text', value: '', placeholder: '10' },
  ], []);

  return usePaginatedList<TPokemonType, PokemonTypeFilters>({
    endpoint: '/api/pokemon/type',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: 'Could not load Pokemon types.',
    normalizeFilters,
  });
}
