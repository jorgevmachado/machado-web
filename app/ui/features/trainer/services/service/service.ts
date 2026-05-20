import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type {
  InitializeTrainerParams,
  OnboardingTrainerParams,
  SelectTrainerEncounterParams,
  TExplorationEvent,
  TBattleLog,
  TTrainer,
  TTrainerEncounter,
  TTrainerHome,
  TTrainerPartyMember,
  TWildPokemonBattleSession,
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
    return await this.get<Array<TTrainerEncounter>>(`${this.pathUrl}/exploration/encounters`);
  }

  public async selectActiveEncounter(
    payload: SelectTrainerEncounterParams,
  ): Promise<TTrainerEncounter> {
    return await this.path<SelectTrainerEncounterParams, TTrainerEncounter>(
      `${this.pathUrl}/exploration/encounters/active`,
      { body: payload },
    );
  }

  public async walk(): Promise<TExplorationEvent> {
    return await this.post<undefined, TExplorationEvent>(`${this.pathUrl}/exploration/walk`);
  }

  public async updateParty(
    payload: UpdateTrainerPartyParams,
  ): Promise<Array<TTrainerPartyMember>> {
    return await this.path<UpdateTrainerPartyParams, Array<TTrainerPartyMember>>(
      `${this.pathUrl}/party`,
      { body: payload },
    );
  }

  public async activeBattle(): Promise<TWildPokemonBattleSession> {
    return await this.get<TWildPokemonBattleSession>(`${this.pathUrl}/battle/active`);
  }

  public async useBattleMove(
    payload: UseBattleMoveParams,
  ): Promise<TWildPokemonBattleSession> {
    return await this.post<UseBattleMoveParams, TWildPokemonBattleSession>(
      `${this.pathUrl}/battle/move`,
      { body: payload },
    );
  }

  public async switchBattlePokemon(
    payload: SwitchBattlePokemonParams,
  ): Promise<TWildPokemonBattleSession> {
    return await this.post<SwitchBattlePokemonParams, TWildPokemonBattleSession>(
      `${this.pathUrl}/battle/switch`,
      { body: payload },
    );
  }

  public async fleeBattle(): Promise<TWildPokemonBattleSession> {
    return await this.post<undefined, TWildPokemonBattleSession>(
      `${this.pathUrl}/battle/flee`,
    );
  }

  public async battleLogs(): Promise<Array<TBattleLog>> {
    return await this.get<Array<TBattleLog>>(`${this.pathUrl}/battle/logs`);
  }
}
