import { getBaseUrl } from '@/app/utils';

import {
  PokemonGrowthRateService
} from './service';

export const pokemonGrowthRateService = (token?: string): PokemonGrowthRateService => {
  return new PokemonGrowthRateService(getBaseUrl(), token);
};