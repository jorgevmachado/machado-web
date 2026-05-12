'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
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
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'fire' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '10' },
  ], [t]);

  return usePaginatedList<TPokemonType, PokemonTypeFilters>({
    endpoint: '/api/pokemon/type',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.type.list.loadError'),
    normalizeFilters,
  });
}
