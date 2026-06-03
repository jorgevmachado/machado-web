import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemonMove,
  TPokemonMoveFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class PokemonMoveService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/move', token);
  }

  public async list(params: TPokemonMoveFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemonMove>> {
    return await this.get<TPaginatedListResponse<TPokemonMove>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonMove> {
    return await this.get<TPokemonMove>(`${this.pathUrl}/${identifier}`);
  }
}