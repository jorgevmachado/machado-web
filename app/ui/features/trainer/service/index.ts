import { getBaseUrl } from '@/app/utils/url/url';

import { TrainerService } from './service';

export const trainerService = (token?: string): TrainerService => {
  return new TrainerService(getBaseUrl(), token);
};

export { TrainerService };
