import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { PokemonTypeDetail, PokemonTypeFilters, PokemonTypeListResponse } from '../types';

export class PokemonTypeService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/type', token);
  }

  public async list(params: PokemonTypeFilters & { page?: string; limit?: string }): Promise<PokemonTypeListResponse> {
    return await this.get<PokemonTypeListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<PokemonTypeDetail> {
    return await this.get<PokemonTypeDetail>(`${this.pathUrl}/${identifier}`);
  }
}
