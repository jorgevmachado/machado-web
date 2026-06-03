import {
  TrainerOwnedPokemonBffService
} from './bffService';

export const trainerOwnedPokemonBffService = (): TrainerOwnedPokemonBffService => {
  return new TrainerOwnedPokemonBffService('trainer/owned-pokemon');
};