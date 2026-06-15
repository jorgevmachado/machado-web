import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TTrainerBattle,
  TTrainerBattleFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerBattleService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/battle', token);
  }

  public async list(params: TTrainerBattleFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TTrainerBattle>> {
    return await this.get<TPaginatedListResponse<TTrainerBattle>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TTrainerBattle> {
    return await this.get<TTrainerBattle>(`${this.pathUrl}/${identifier}`);
  }
}