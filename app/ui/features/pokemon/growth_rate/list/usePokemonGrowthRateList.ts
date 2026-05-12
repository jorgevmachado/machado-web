'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonGrowthRateFilters, TPokemonGrowthRate } from '../types';

const INITIAL_FILTERS: PokemonGrowthRateFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonGrowthRateFilters): PokemonGrowthRateFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonGrowthRateList() {
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'tackle' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '33' },
  ], [t]);

  return usePaginatedList<TPokemonGrowthRate, PokemonGrowthRateFilters>({
    endpoint: '/api/pokemon/growth-rate',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.growthRate.list.loadError'),
    normalizeFilters,
  });
}
