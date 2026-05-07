import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonAbilityService } from './service';

export const pokemonAbilityService = (token?: string): PokemonAbilityService => {
  return new PokemonAbilityService(getBaseUrl(), token);
};

export { PokemonAbilityService };
