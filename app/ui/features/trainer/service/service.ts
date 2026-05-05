import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { InitializeTrainerParams, TTrainer } from '../types';

export class TrainerService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer', token);
  }

  public async initialize(payload: InitializeTrainerParams): Promise<TTrainer> {
    return await this.post<InitializeTrainerParams, TTrainer>(this.pathUrl, {
      body: payload,
    });
  }
}
