import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { PokedexListFilters, TPokedex, TPokedexListResponse } from '../types';

export class PokedexService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/pokedex', token);
  }

  public async list(params: PokedexListFilters & { page?: string; limit?: string }): Promise<TPokedexListResponse> {
    return await this.get<TPokedexListResponse>(this.pathUrl, { params });
  }

  public async detail(name: string): Promise<TPokedex> {
    return await this.get<TPokedex>(`${this.pathUrl}/${name}`);
  }

  public async discover(name: string): Promise<TPokedex> {
    return await this.post<undefined, TPokedex>(`${this.pathUrl}/${name}/discover`);
  }
}
