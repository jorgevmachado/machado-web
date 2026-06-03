import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TOwnedPokemon,
  TOwnedPokemonFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerOwnedPokemonService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/owned-pokemon', token);
  }

  public async list(params: TOwnedPokemonFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TOwnedPokemon>> {
    return await this.get<TPaginatedListResponse<TOwnedPokemon>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TOwnedPokemon> {
    return await this.get<TOwnedPokemon>(`${this.pathUrl}/${identifier}`);
  }
}