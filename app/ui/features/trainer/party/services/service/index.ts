import { getBaseUrl } from '@/app/utils';

import {
  TrainerPartyService
} from './service';

export const trainerPartyService = (token?: string): TrainerPartyService => {
  return new TrainerPartyService(getBaseUrl(), token);
};