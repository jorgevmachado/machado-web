import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonTypeService } from './service';

export const pokemonTypeService = (token?: string): PokemonTypeService => {
  return new PokemonTypeService(getBaseUrl(), token);
};

export { PokemonTypeService } from './service';
