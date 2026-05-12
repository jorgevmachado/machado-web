'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokemonAbilityFilters, TPokemonAbility } from '../types';

const INITIAL_FILTERS: PokemonAbilityFilters = {
  name: undefined,
  order: undefined,
};

const normalizeFilters = (filters: PokemonAbilityFilters): PokemonAbilityFilters => ({
  name: filters.name?.trim() || undefined,
  order: filters.order?.trim() || undefined,
});

export function usePokemonAbilityList() {
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'overgrow' },
    { name: 'order', label: t('filters.order'), type: 'text', value: '', placeholder: '65' },
  ], [t]);

  return usePaginatedList<TPokemonAbility, PokemonAbilityFilters>({
    endpoint: '/api/pokemon/ability',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokemon.ability.list.loadError'),
    normalizeFilters,
  });
}
