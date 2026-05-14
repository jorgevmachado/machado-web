import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { OnboardingTrainerParams, TTrainer } from '../types';

export class TrainerService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer', token);
  }

  public async onboard(payload: OnboardingTrainerParams): Promise<TTrainer> {
    return await this.post<OnboardingTrainerParams, TTrainer>(`${this.pathUrl}/onboarding`, {
      body: payload,
    });
  }
}
