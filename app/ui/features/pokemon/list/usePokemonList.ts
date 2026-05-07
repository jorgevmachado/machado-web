'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonListFilters, TPokemon } from '../types';

const INITIAL_FILTERS: PokemonListFilters = {
  name: undefined,
  order: undefined,
  status: undefined,
  type: undefined,
};

const normalizeFilters = (filters: PokemonListFilters): PokemonListFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
  status: filters.status?.trim() || undefined,
  type: filters.type?.trim() || undefined,
});

export function usePokemonList() {
  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: 'Name', type: 'text', value: '', placeholder: 'Pikachu' },
    { name: 'order', label: 'Order', type: 'text', value: '', placeholder: '25' },
    { name: 'type', label: 'Type', type: 'text', value: '', placeholder: 'electric' },
    { name: 'status', label: 'Status', type: 'text', value: '', placeholder: 'COMPLETE' },
  ], []);

  return usePaginatedList<TPokemon, PokemonListFilters>({
    endpoint: '/api/pokemon',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: 'Could not load Pokemon.',
    normalizeFilters,
  });
}
