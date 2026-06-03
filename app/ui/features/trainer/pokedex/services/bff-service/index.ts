import {
  TrainerPokedexBffService
} from './bffService';

export const trainerPokedexBffService = (): TrainerPokedexBffService => {
  return new TrainerPokedexBffService('trainer/pokedex');
};