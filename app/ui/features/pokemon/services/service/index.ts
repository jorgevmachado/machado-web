import { getBaseUrl } from '@/app/utils';

import {
  PokemonService
} from './service';

export const pokemonService = (token?: string): PokemonService => {
  return new PokemonService(getBaseUrl(), token);
};