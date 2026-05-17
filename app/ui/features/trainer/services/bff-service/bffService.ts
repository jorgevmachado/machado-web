import { BffBaseServiceAbstract, BffResponse } from '@/app/shared/services/bff-service';
import { OnboardingTrainerBffParams } from '@/app/ui/features/trainer/services/bff-service/types';
import { OnboardingTrainerParams, TTrainer } from '@/app/ui/features/trainer/types';

export class TrainerBffService extends BffBaseServiceAbstract<TTrainer> {
  constructor(baseUrl: string) {
    super('trainer', baseUrl);
  }

  public async onboarding({
    is_admin,
    nickname,
    pokeballs,
    capture_rate,
    pokemon_name,
    fetchErrorMessage
  }: OnboardingTrainerBffParams): Promise<BffResponse<TTrainer>> {
    const resultResponse: BffResponse<TTrainer> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: fetchErrorMessage,
    };
    const payload: OnboardingTrainerParams = {
      nickname,
      pokemon_name,
      ...(is_admin ? {
        pokeballs,
        capture_rate,
      } : {})
    };
    const response = await this.post<OnboardingTrainerParams, TTrainer>(`${this.pathUrl}/onboarding`, {
      body: payload,
    });

    if (this.isResponseError(response)) {
      resultResponse.status = response.statusCode;
      resultResponse.message = response.message;
      return resultResponse;
    }

    resultResponse.data = response;
    resultResponse.error = false;
    resultResponse.status = 200;
    resultResponse.message = 'OK';
    return resultResponse;
  }
}
