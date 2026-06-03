import {
  TrainerEncounterBffService
} from './bffService';

export const trainerEncounterBffService = (): TrainerEncounterBffService => {
  return new TrainerEncounterBffService('trainer/encounter');
};