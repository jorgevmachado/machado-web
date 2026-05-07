import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { TPokemon, PokemonListFilters, PokemonListResponse } from '../types';

export class PokemonService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon', token);
  }

  public async list(params: PokemonListFilters & { page?: string; limit?: string }): Promise<PokemonListResponse> {
    return await this.get<PokemonListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemon> {
    return await this.get<TPokemon>(`${this.pathUrl}/${identifier}`);
  }
}
