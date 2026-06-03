import {
  PokemonEncounterBffService
} from './bffService';

export const pokemonEncounterBffService = (): PokemonEncounterBffService => {
  return new PokemonEncounterBffService('pokemon/encounter');
};