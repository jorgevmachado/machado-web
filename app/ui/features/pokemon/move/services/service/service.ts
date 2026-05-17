import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { TPokemonMove, PokemonMoveFilters, PokemonMoveListResponse } from '../../types';

export class PokemonMoveService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/move', token);
  }

  public async list(params: PokemonMoveFilters & { page?: string; limit?: string }): Promise<PokemonMoveListResponse> {
    return await this.get<PokemonMoveListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonMove> {
    return await this.get<TPokemonMove>(`${this.pathUrl}/${identifier}`);
  }
}
