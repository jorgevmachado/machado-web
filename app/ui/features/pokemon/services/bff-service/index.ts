import {
  PokemonBffService
} from './bffService';

export const pokemonBffService = (): PokemonBffService => {
  return new PokemonBffService('pokemon');
};