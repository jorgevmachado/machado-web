import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import type { ResponseError } from '@/app/shared/services/http';

import type {
  BattleLog,
  BattleSession,
  SwitchPokemonPayload,
  UseMovePayload,
} from '../types';

export class BattleBffService extends BffBaseServiceAbstract<BattleSession> {
  constructor(baseUrl: string = '/api') {
    super('trainer', 'trainer/battle', baseUrl);
  }

  public async active(): Promise<BattleSession | ResponseError> {
    return await this.get<BattleSession | ResponseError>(`${this.pathUrl}/active`);
  }

  public async logs(): Promise<Array<BattleLog> | ResponseError> {
    return await this.get<Array<BattleLog> | ResponseError>(`${this.pathUrl}/logs`);
  }

  public async useMove(payload: UseMovePayload): Promise<BattleSession | ResponseError> {
    return await this.post<UseMovePayload, BattleSession | ResponseError>(
      `${this.pathUrl}/move`,
      { body: payload },
    );
  }

  public async switchPokemon(payload: SwitchPokemonPayload): Promise<BattleSession | ResponseError> {
    return await this.post<SwitchPokemonPayload, BattleSession | ResponseError>(
      `${this.pathUrl}/switch`,
      { body: payload },
    );
  }

  public async flee(): Promise<BattleSession | ResponseError> {
    return await this.post<undefined, BattleSession | ResponseError>(
      `${this.pathUrl}/flee`,
    );
  }
}

export const battleBffService = new BattleBffService();

