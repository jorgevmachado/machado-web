import { getBaseUrl } from '@/app/utils';

import {
  TrainerEncounterService
} from './service';

export const trainerEncounterService = (token?: string): TrainerEncounterService => {
  return new TrainerEncounterService(getBaseUrl(), token);
};