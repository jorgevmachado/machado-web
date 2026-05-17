'use client';

import { useDetail } from '@/app/ui/hooks/detail';

import { pokemonGrowthRateBffService } from '../services';
import type { TPokemonGrowthRate } from '../types';

export function usePokemonGrowthRateDetail(identifier: string) {
  return useDetail<TPokemonGrowthRate>({
    identifier,
    fetchDetail: pokemonGrowthRateBffService.fetchOne,
    fetchErrorMessage: 'pokemon.growthRate.detail.loadError',
  });
}
