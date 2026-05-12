'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
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
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'Pikachu' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '25' },
    { name: 'type', label: t('filters.type'), type: 'text', value: '', placeholder: 'electric' },
    { name: 'status', label: t('filters.status'), type: 'text', value: '', placeholder: 'COMPLETE' },
  ], [t]);

  return usePaginatedList<TPokemon, PokemonListFilters>({
    endpoint: '/api/pokemon',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.list.loadError'),
    normalizeFilters,
  });
}
