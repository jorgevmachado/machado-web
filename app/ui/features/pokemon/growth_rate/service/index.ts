import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonGrowthRateService } from './service';

export const pokemonGrowthRateService = (token?: string): PokemonGrowthRateService => {
  return new PokemonGrowthRateService(getBaseUrl(), token);
};

export { PokemonGrowthRateService };
