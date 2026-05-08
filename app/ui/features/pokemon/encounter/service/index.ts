import { getBaseUrl } from '@/app/utils/url/url';

import { PokemonEncounterService } from './service';

export const pokemonEncounterService = (token?: string): PokemonEncounterService => {
  return new PokemonEncounterService(getBaseUrl(), token);
};

export { PokemonEncounterService };
