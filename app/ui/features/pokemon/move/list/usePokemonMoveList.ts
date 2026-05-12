'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonMoveFilters, TPokemonMove } from '../types';

const INITIAL_FILTERS: PokemonMoveFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonMoveFilters): PokemonMoveFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonMoveList() {
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'tackle' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '33' },
  ], [t]);

  return usePaginatedList<TPokemonMove, PokemonMoveFilters>({
    endpoint: '/api/pokemon/move',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.move.list.loadError'),
    normalizeFilters,
  });
}
