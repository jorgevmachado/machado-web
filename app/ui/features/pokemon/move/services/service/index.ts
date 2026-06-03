import { getBaseUrl } from '@/app/utils';

import {
  PokemonMoveService
} from './service';

export const pokemonMoveService = (token?: string): PokemonMoveService => {
  return new PokemonMoveService(getBaseUrl(), token);
};