import { getBaseUrl } from '@/app/utils';

import {
  TrainerService
} from './service';

export const trainerService = (token?: string): TrainerService => {
  return new TrainerService(getBaseUrl(), token);
};