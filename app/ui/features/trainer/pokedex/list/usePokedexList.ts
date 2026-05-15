'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { PokedexListFilters, TPokedex } from '../types';

const INITIAL_FILTERS: PokedexListFilters = {
  nickname: undefined,
  pokemon_name: undefined,
  discovered: undefined,
};

const normalizeFilters = (filters: PokedexListFilters): PokedexListFilters => ({
  nickname: filters.nickname?.trim() || undefined,
  pokemon_name: filters.pokemon_name?.trim() || undefined,
  discovered: filters.discovered?.trim().toLowerCase() || undefined,
});

export function usePokedexList() {
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'nickname', label: t('pokedex.filters.nickname'), type: 'text', value: '', placeholder: 'Leaf' },
    { name: 'pokemon_name', label: t('pokedex.filters.basePokemon'), type: 'text', value: '', placeholder: 'bulbasaur' },
    { name: 'discovered', label: t('pokedex.filters.discovered'), type: 'text', value: '', placeholder: 'true / false' },
  ], [t]);

  return usePaginatedList<TPokedex, PokedexListFilters>({
    endpoint: '/api/trainer/pokedex',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('pokedex.list.loadError'),
    normalizeFilters,
  });
}
