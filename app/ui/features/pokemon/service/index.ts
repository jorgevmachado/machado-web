import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonService } from './service';

export const pokemonService = (token?: string): PokemonService => {
  return new PokemonService(getBaseUrl(), token);
};

export { PokemonService };
