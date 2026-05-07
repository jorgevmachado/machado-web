import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { TPokemonGrowthRate, PokemonGrowthRateFilters, PokemonGrowthRateListResponse } from '../types';

export class PokemonGrowthRateService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/growth-rate', token);
  }

  public async list(params: PokemonGrowthRateFilters & { page?: string; limit?: string }): Promise<PokemonGrowthRateListResponse> {
    return await this.get<PokemonGrowthRateListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonGrowthRate> {
    return await this.get<TPokemonGrowthRate>(`${this.pathUrl}/${identifier}`);
  }
}
