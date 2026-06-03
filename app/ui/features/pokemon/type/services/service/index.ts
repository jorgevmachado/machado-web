import { getBaseUrl } from '@/app/utils';

import {
  PokemonTypeService
} from './service';

export const pokemonTypeService = (token?: string): PokemonTypeService => {
  return new PokemonTypeService(getBaseUrl(), token);
};