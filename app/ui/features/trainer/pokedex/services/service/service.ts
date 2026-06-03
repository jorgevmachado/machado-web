import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokedex,
  TPokedexFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerPokedexService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/pokedex', token);
  }

  public async list(params: TPokedexFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokedex>> {
    return await this.get<TPaginatedListResponse<TPokedex>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokedex> {
    return await this.get<TPokedex>(`${this.pathUrl}/${identifier}`);
  }
}