import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type {
  OnboardingTrainerParams,
  SelectTrainerEncounterParams,
  TExplorationEvent,
  TTrainer,
  TTrainerEncounter,
  TTrainerHome,
  TTrainerPartyMember,
  UpdateTrainerPartyParams,
} from '../types';

export class TrainerService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer', token);
  }

  public async onboard(payload: OnboardingTrainerParams): Promise<TTrainer> {
    return await this.post<OnboardingTrainerParams, TTrainer>(`${this.pathUrl}/onboarding`, {
      body: payload,
    });
  }

  public async home(): Promise<TTrainerHome> {
    return await this.get<TTrainerHome>(`${this.pathUrl}/home`);
  }

  public async encounters(): Promise<Array<TTrainerEncounter>> {
    return await this.get<Array<TTrainerEncounter>>(`${this.pathUrl}/encounters`);
  }

  public async selectActiveEncounter(
    payload: SelectTrainerEncounterParams,
  ): Promise<TTrainerEncounter> {
    return await this.path<SelectTrainerEncounterParams, TTrainerEncounter>(
      `${this.pathUrl}/encounters/active`,
      { body: payload },
    );
  }

  public async walk(): Promise<TExplorationEvent> {
    return await this.post<undefined, TExplorationEvent>(`${this.pathUrl}/walk`);
  }

  public async updateParty(
    payload: UpdateTrainerPartyParams,
  ): Promise<Array<TTrainerPartyMember>> {
    return await this.path<UpdateTrainerPartyParams, Array<TTrainerPartyMember>>(
      `${this.pathUrl}/party`,
      { body: payload },
    );
  }
}
