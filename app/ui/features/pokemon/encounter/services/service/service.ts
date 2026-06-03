import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemonEncounter,
  TPokemonEncounterFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class PokemonEncounterService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/encounter', token);
  }

  public async list(params: TPokemonEncounterFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemonEncounter>> {
    return await this.get<TPaginatedListResponse<TPokemonEncounter>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonEncounter> {
    return await this.get<TPokemonEncounter>(`${this.pathUrl}/${identifier}`);
  }
}