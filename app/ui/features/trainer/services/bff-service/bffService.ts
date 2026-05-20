import { BffBaseServiceAbstract, BffResponse } from '@/app/shared/services/bff-service';
import { OnboardingTrainerBffParams } from '@/app/ui/features/trainer/services/bff-service/types';
import {
  OnboardingTrainerParams,
  TBattleLog,
  TTrainer,
  TTrainerEncounter,
  TTrainerHome,
  TWildPokemonBattleSession,
} from '@/app/ui/features/trainer/types';

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

  public async home(): Promise<BffResponse<TTrainerHome>> {
    const resultResponse: BffResponse<TTrainerHome> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: 'trainer.home.loadError',
    };

    const response = await this.get<TTrainerHome>(`${this.pathUrl}/home`);

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

  public async encounters(): Promise<BffResponse<TTrainerEncounter>> {
    const resultResponse: BffResponse<TTrainerEncounter> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: 'trainer.encounter.loadError',
    };

    const response = await this.get<TTrainerEncounter>(`${this.pathUrl}/encounters`);

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

  public async activeBattle(): Promise<BffResponse<TWildPokemonBattleSession>> {
    const resultResponse: BffResponse<TWildPokemonBattleSession> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: 'trainer.battle.loadError',
    };

    const response = await this.get<TWildPokemonBattleSession>(`${this.pathUrl}/battle/active`);

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

  public async battleLogs(): Promise<BffResponse<Array<TBattleLog>>> {
    const resultResponse: BffResponse<Array<TBattleLog>> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: 'trainer.battle.logsError',
    };

    const response = await this.get<Array<TBattleLog>>(`${this.pathUrl}/battle/logs`);

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
