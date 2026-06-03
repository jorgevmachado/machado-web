import {
  PokemonAbilityBffService
} from './bffService';

export const pokemonAbilityBffService = (): PokemonAbilityBffService => {
  return new PokemonAbilityBffService('pokemon/ability');
};