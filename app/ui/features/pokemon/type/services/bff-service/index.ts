import {
  PokemonTypeBffService
} from './bffService';

export const pokemonTypeBffService = (): PokemonTypeBffService => {
  return new PokemonTypeBffService('pokemon/type');
};