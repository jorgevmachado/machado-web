import { getBaseUrl } from '@/app/utils';

import {
  PokemonAbilityService
} from './service';

export const pokemonAbilityService = (token?: string): PokemonAbilityService => {
  return new PokemonAbilityService(getBaseUrl(), token);
};