import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemonAbility,
  TPokemonAbilityFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class PokemonAbilityService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon/ability', token);
  }

  public async list(params: TPokemonAbilityFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemonAbility>> {
    return await this.get<TPaginatedListResponse<TPokemonAbility>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemonAbility> {
    return await this.get<TPokemonAbility>(`${this.pathUrl}/${identifier}`);
  }
}