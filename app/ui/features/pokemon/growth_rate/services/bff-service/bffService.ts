import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TPokemonGrowthRate } from '@/app/ui';

export class PokemonGrowthRateBffService extends BffBaseServiceAbstract<TPokemonGrowthRate> {
  constructor(baseUrl: string) {
    super('pokemon.growth-rate' ,baseUrl);
  }
}