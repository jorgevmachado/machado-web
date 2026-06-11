import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokedexEntry ,
  TPokedexEntryFilters ,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerPokedexService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/pokedex', token);
  }

  public async list(params: TPokedexEntryFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokedexEntry>> {
    return await this.get<TPaginatedListResponse<TPokedexEntry>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokedexEntry> {
    return await this.get<TPokedexEntry>(`${this.pathUrl}/${identifier}`);
  }
}