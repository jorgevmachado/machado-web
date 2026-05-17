'use client';

import { useDetail } from '@/app/ui/hooks/detail';

import { pokemonTypeBffService } from '../services';
import type { TPokemonType } from '../types';

export function usePokemonTypeDetail(identifier: string) {
  return useDetail<TPokemonType>({
    identifier,
    fetchDetail: pokemonTypeBffService.fetchOne,
    fetchErrorMessage: 'pokemon.type.detail.loadError',
  });
}
