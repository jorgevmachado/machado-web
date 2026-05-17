import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import type { TPokemon, PokemonListFilters, PokemonListResponse } from '../../types';
import { PokemonAbilityService } from '@/app/ui/features/pokemon/ability/services';
import { PokemonEncounterService } from '@/app/ui/features/pokemon/encounter/services';
import { PokemonGrowthRateService } from '../../growth_rate/services/service';
import { PokemonMoveService } from '../../move/services/service';
import { PokemonTypeService } from '../../type/services/service';

export class PokemonService extends BaseServiceAbstract {
  private readonly abilityModule: PokemonAbilityService;
  private readonly encounterModule: PokemonEncounterService;
  private readonly growthRateModule: PokemonGrowthRateService;
  private readonly moveModule: PokemonMoveService;
  private readonly typeModule: PokemonTypeService;

  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon', token);
    this.abilityModule = new PokemonAbilityService(baseUrl, token);
    this.encounterModule = new PokemonEncounterService(baseUrl, token);
    this.growthRateModule = new PokemonGrowthRateService(baseUrl, token);
    this.moveModule = new PokemonMoveService(baseUrl, token);
    this.typeModule = new PokemonTypeService(baseUrl, token);
  }

  get ability(): PokemonAbilityService {
    return this.abilityModule;
  }

  get encounter(): PokemonEncounterService {
    return this.encounterModule;
  }

  get growthRate(): PokemonGrowthRateService {
    return this.growthRateModule;
  }

  get move(): PokemonMoveService {
    return this.moveModule;
  }

  get type(): PokemonTypeService {
    return this.typeModule;
  }

  public async list(params: PokemonListFilters & { page?: string; limit?: string }): Promise<PokemonListResponse> {
    return await this.get<PokemonListResponse>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemon> {
    return await this.get<TPokemon>(`${this.pathUrl}/${identifier}`);
  }
}
