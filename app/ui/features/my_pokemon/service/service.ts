import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type {
  CreateMyPokemonPayload,
  MyPokemonListFilters,
  MyPokemonListResponse,
  TMyPokemon,
} from '../types';

export class MyPokemonService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'my-pokemon', token);
  }

  public async list(params: MyPokemonListFilters & { page?: string; limit?: string }): Promise<MyPokemonListResponse> {
    return await this.get<MyPokemonListResponse>(this.pathUrl, { params });
  }

  public async detail(name: string): Promise<TMyPokemon> {
    return await this.get<TMyPokemon>(`${this.pathUrl}/${name}`);
  }

  public async create(payload: CreateMyPokemonPayload): Promise<TMyPokemon> {
    return await this.post<CreateMyPokemonPayload, TMyPokemon>(this.pathUrl, { body: payload });
  }
}
