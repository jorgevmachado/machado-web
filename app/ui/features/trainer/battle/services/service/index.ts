import { getBaseUrl } from '@/app/utils';

import {
  TrainerBattleService
} from './service';

export const trainerBattleService = (token?: string): TrainerBattleService => {
  return new TrainerBattleService(getBaseUrl(), token);
};