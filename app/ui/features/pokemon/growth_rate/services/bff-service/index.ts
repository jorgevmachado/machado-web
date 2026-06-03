import {
  PokemonGrowthRateBffService
} from './bffService';

export const pokemonGrowthRateBffService = (): PokemonGrowthRateBffService => {
  return new PokemonGrowthRateBffService('pokemon/growth_rate');
};