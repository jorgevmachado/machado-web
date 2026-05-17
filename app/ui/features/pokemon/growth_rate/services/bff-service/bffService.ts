import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TPokemonGrowthRate } from '@/app/ui/features/pokemon/growth_rate';

export class PokemonGrowthRateBffService extends BffBaseServiceAbstract<TPokemonGrowthRate> {
  constructor(baseUrl: string) {
    super('pokemon.growthRate', baseUrl);
  }
}