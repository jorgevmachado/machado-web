import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { TPokemonEncounter, PokemonEncounterFilters, PokemonEncounterListResponse } from '../types';

export class PokemonEncounterService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/encounter', token);
  }

  public async list(params: PokemonEncounterFilters & { page?: string; limit?: string }): Promise<PokemonEncounterListResponse> {
    return await this.get<PokemonEncounterListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonEncounter> {
    return await this.get<TPokemonEncounter>(`${this.pathUrl}/${identifier}`);
  }
}
