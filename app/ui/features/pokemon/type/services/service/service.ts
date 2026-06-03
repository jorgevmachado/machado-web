import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemonType,
  TPokemonTypeFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class PokemonTypeService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/type', token);
  }

  public async list(params: TPokemonTypeFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemonType>> {
    return await this.get<TPaginatedListResponse<TPokemonType>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonType> {
    return await this.get<TPokemonType>(`${this.pathUrl}/${identifier}`);
  }
}