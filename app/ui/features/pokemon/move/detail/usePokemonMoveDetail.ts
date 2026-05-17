'use client';

import { useDetail } from '@/app/ui/hooks/detail';

import { pokemonMoveBffService } from '../services';
import type { TPokemonMove } from '../types';

export function usePokemonMoveDetail(identifier: string) {
  return useDetail<TPokemonMove>({
    identifier,
    fetchDetail: pokemonMoveBffService.fetchOne,
    fetchErrorMessage: 'pokemon.move.detail.loadError',
  });
}
