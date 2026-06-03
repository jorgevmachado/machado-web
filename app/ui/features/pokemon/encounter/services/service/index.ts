import { getBaseUrl } from '@/app/utils';

import {
  PokemonEncounterService
} from './service';

export const pokemonEncounterService = (token?: string): PokemonEncounterService => {
  return new PokemonEncounterService(getBaseUrl(), token);
};