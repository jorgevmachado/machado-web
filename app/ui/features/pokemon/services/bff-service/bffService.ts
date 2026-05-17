import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TPokemon } from '@/app/ui/features/pokemon/types';
import { PokemonAbilityBffService } from '@/app/ui/features/pokemon/ability/services';
import { PokemonEncounterBffService } from '@/app/ui/features/pokemon/encounter/services';
import { PokemonGrowthRateBffService } from '@/app/ui/features/pokemon/growth_rate/services';
import { PokemonMoveBffService } from '@/app/ui/features/pokemon/move/services';
import { PokemonTypeBffService } from '@/app/ui/features/pokemon/type/services';

export class PokemonBffService extends BffBaseServiceAbstract<TPokemon> {
  private readonly abilityModule: PokemonAbilityBffService;
  private readonly encounterModule: PokemonEncounterBffService;
  private readonly growthRateModule: PokemonGrowthRateBffService;
  private readonly moveModule: PokemonMoveBffService;
  private readonly typeModule: PokemonTypeBffService;

  constructor(baseUrl: string) {
    super('pokemon', baseUrl);
    this.abilityModule = new PokemonAbilityBffService(baseUrl);
    this.encounterModule = new PokemonEncounterBffService(baseUrl);
    this.growthRateModule = new PokemonGrowthRateBffService(baseUrl);
    this.moveModule = new PokemonMoveBffService(baseUrl);
    this.typeModule = new PokemonTypeBffService(baseUrl);
  }

  get ability(): PokemonAbilityBffService {
    return this.abilityModule;
  }

  get encounter(): PokemonEncounterBffService {
    return this.encounterModule;
  }

  get growthRate(): PokemonGrowthRateBffService {
    return this.growthRateModule;
  }

  get move(): PokemonMoveBffService {
    return this.moveModule;
  }

  get type(): PokemonTypeBffService {
    return this.typeModule;
  }
}