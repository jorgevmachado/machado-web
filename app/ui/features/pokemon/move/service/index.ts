import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonMoveService } from './service';

export const pokemonMoveService = (token?: string): PokemonMoveService => {
  return new PokemonMoveService(getBaseUrl(), token);
};

export { PokemonMoveService };
