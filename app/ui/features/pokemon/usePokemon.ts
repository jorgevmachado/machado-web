'use client';
import { TPaginatedListResponse } from '@/app/ds';
import { pokemonBffService } from '@/app/ui/features/pokemon/services';
import { PokemonListFilters, TPokemon } from '@/app/ui/features/pokemon/types';
import useDomain from '@/app/ui/hooks/domain/useDomain';

type UsePokemonResult = {
  fetchOne: (identifier: string, fetchErrorMessage?: string) => Promise<TPokemon | undefined>;
  fetchList: (filters: PokemonListFilters, perPage?: number, fetchErrorMessage?: string) => Promise<Array<TPokemon>>;
  isContentLoading: boolean;
  fetchListPaginate: (
    page: number,
    filters: PokemonListFilters,
    perPage?: number,
    fetchErrorMessage?: string,
  ) => Promise<TPaginatedListResponse<TPokemon> | undefined>;
};

const usePokemon = (): UsePokemonResult => {
  const {
    fetchOne,
    fetchList,
    isContentLoading,
    fetchListPaginate,
  } = useDomain<TPokemon, PokemonListFilters>({
    getOne: pokemonBffService.fetchOne,
    getAll: pokemonBffService.fetchAll,
  });

  return {
    fetchOne,
    fetchList,
    isContentLoading,
    fetchListPaginate,
  };
};

export default usePokemon;
