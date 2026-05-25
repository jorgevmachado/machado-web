import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type {
  CaptureBattlePokemonParams,
  InitializeTrainerParams,
  OnboardingTrainerParams,
  SelectTrainerEncounterParams,
  TBattleCaptureResult,
  TBattleLog,
  TBattleSession,
  TExplorationEvent,
  TTrainer,
  TTrainerEncounter,
  TTrainerHome,
  TTrainerPartyMember,
  SwitchBattlePokemonParams,
  UpdateTrainerPartyParams,
  UseBattleMoveParams,
} from '../../types';

export class TrainerService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer', token);
  }

  public async initialize(payload: InitializeTrainerParams): Promise<TTrainer> {
    return await this.post<InitializeTrainerParams, TTrainer>(`${this.pathUrl}/initialize`, {
      body: payload,
    });
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
    return await this.get<Array<TTrainerEncounter>>(`${this.pathUrl}/encounter`);
  }

  public async selectActiveEncounter(
    payload: SelectTrainerEncounterParams,
  ): Promise<TTrainerEncounter> {
    return await this.path<SelectTrainerEncounterParams, TTrainerEncounter>(
      `${this.pathUrl}/encounter/active`,
      { body: payload },
    );
  }

  public async walk(): Promise<TExplorationEvent> {
    return await this.post<undefined, TExplorationEvent>(`${this.pathUrl}/encounter/walk`);
  }

  public async updateParty(
    payload: UpdateTrainerPartyParams,
  ): Promise<Array<TTrainerPartyMember>> {
    return await this.path<UpdateTrainerPartyParams, Array<TTrainerPartyMember>>(
      `${this.pathUrl}/party`,
      { body: payload },
    );
  }

  public async activeBattle(): Promise<TBattleSession> {
    return await this.get<TBattleSession>(`${this.pathUrl}/battle/active`);
  }

  public async useBattleMove(
    payload: UseBattleMoveParams,
  ): Promise<TBattleSession> {
    return await this.post<UseBattleMoveParams, TBattleSession>(
      `${this.pathUrl}/battle/move`,
      { body: payload },
    );
  }

  public async switchBattlePokemon(
    payload: SwitchBattlePokemonParams,
  ): Promise<TBattleSession> {
    return await this.post<SwitchBattlePokemonParams, TBattleSession>(
      `${this.pathUrl}/battle/switch`,
      { body: payload },
    );
  }

  public async fleeBattle(): Promise<TBattleSession> {
    return await this.post<undefined, TBattleSession>(
      `${this.pathUrl}/battle/flee`,
    );
  }

  public async captureBattlePokemon(
    payload: CaptureBattlePokemonParams = {},
  ): Promise<TBattleCaptureResult> {
    return await this.post<CaptureBattlePokemonParams, TBattleCaptureResult>(
      `${this.pathUrl}/battle/capture`,
      { body: payload },
    );
  }

  public async battleLogs(): Promise<Array<TBattleLog>> {
    return await this.get<Array<TBattleLog>>(`${this.pathUrl}/battle/logs`);
  }
}
