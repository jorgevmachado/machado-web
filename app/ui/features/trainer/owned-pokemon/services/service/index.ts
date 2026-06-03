import { getBaseUrl } from '@/app/utils';

import {
  TrainerOwnedPokemonService
} from './service';

export const trainerOwnedPokemonService = (token?: string): TrainerOwnedPokemonService => {
  return new TrainerOwnedPokemonService(getBaseUrl(), token);
};