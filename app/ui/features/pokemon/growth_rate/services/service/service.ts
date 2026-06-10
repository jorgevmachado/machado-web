import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemonGrowthRate,
  TPokemonGrowthRateFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class PokemonGrowthRateService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/growth-rate', token);
  }

  public async list(params: TPokemonGrowthRateFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemonGrowthRate>> {
    return await this.get<TPaginatedListResponse<TPokemonGrowthRate>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonGrowthRate> {
    return await this.get<TPokemonGrowthRate>(`${this.pathUrl}/${identifier}`);
  }
}