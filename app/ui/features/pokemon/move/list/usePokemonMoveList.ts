'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonMoveFilters, PokemonMoveListItem } from '../types';

const INITIAL_FILTERS: PokemonMoveFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonMoveFilters): PokemonMoveFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonMoveList() {
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'tackle' },
    { name: 'order', label: 'Order', type: 'text', value: '', placeholder: '33' },
  ], []);

  return usePaginatedList<PokemonMoveListItem, PokemonMoveFilters>({
    endpoint: '/api/pokemon/move',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: 'Could not load Pokemon moves.',
    normalizeFilters,
  });
}
