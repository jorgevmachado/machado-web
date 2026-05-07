import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { PokemonAbilityDetail, PokemonAbilityFilters, PokemonAbilityListResponse } from '../types';

export class PokemonAbilityService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/ability', token);
  }

  public async list(params: PokemonAbilityFilters & { page?: string; limit?: string }): Promise<PokemonAbilityListResponse> {
    return await this.get<PokemonAbilityListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<PokemonAbilityDetail> {
    return await this.get<PokemonAbilityDetail>(`${this.pathUrl}/${identifier}`);
  }
}
