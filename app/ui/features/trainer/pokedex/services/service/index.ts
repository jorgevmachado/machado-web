import { getBaseUrl } from '@/app/utils';

import {
  TrainerPokedexService
} from './service';

export const trainerPokedexService = (token?: string): TrainerPokedexService => {
  return new TrainerPokedexService(getBaseUrl(), token);
};