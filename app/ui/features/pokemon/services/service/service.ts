import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TPokemon,
  TPokemonFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';
import {
  PokemonAbilityService
} from '@/app/ui/features/pokemon/ability/services/service/service';
import {
  PokemonEncounterService
} from '@/app/ui/features/pokemon/encounter/services/service/service';
import {
  PokemonGrowthRateService
} from '@/app/ui/features/pokemon/growth_rate/services/service/service';
import {
  PokemonMoveService
} from '@/app/ui/features/pokemon/move/services/service/service';
import {
  PokemonTypeService
} from '@/app/ui/features/pokemon/type/services/service/service';


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

  public async list(params: TPokemonFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TPokemon>> {
    return await this.get<TPaginatedListResponse<TPokemon>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TPokemon> {
    return await this.get<TPokemon>(`${this.pathUrl}/${identifier}`);
  }
}