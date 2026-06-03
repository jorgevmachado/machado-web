import {
  PokemonMoveBffService
} from './bffService';

export const pokemonMoveBffService = (): PokemonMoveBffService => {
  return new PokemonMoveBffService('pokemon/move');
};