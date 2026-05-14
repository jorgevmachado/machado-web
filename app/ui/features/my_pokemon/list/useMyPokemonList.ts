'use client';

import { useMemo } from 'react';

import type { FiltersProps } from '@/app/ds';
import { useAppTranslation } from '@/app/i18n';
import usePaginatedList from '@/app/ui/hooks/list/usePaginatedList';

import type { MyPokemonListFilters, TMyPokemon } from '../types';

const INITIAL_FILTERS: MyPokemonListFilters = {
  name: undefined,
  pokemon_name: undefined,
};

const normalizeFilters = (filters: MyPokemonListFilters): MyPokemonListFilters => ({
  name: filters.name?.trim() || undefined,
  pokemon_name: filters.pokemon_name?.trim() || undefined,
});

export function useMyPokemonList() {
  const { t } = useAppTranslation();

  const initialInputFilters = useMemo<FiltersProps['filters']>(() => [
    { name: 'name', label: t('filters.name'), type: 'text', value: '', placeholder: 'charizard-2' },
    { name: 'pokemon_name', label: t('myPokemon.filters.basePokemon'), type: 'text', value: '', placeholder: 'charizard' },
  ], [t]);

  return usePaginatedList<TMyPokemon, MyPokemonListFilters>({
    endpoint: '/api/my-pokemon',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters,
    fetchErrorMessage: t('myPokemon.list.loadError'),
    normalizeFilters,
  });
}
