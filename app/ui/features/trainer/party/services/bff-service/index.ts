import {
  TrainerPartyBffService
} from './bffService';

export const trainerPartyBffService = (): TrainerPartyBffService => {
  return new TrainerPartyBffService('trainer/party');
};