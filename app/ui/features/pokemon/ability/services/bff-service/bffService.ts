import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TPokemonAbility } from '@/app/ui';

export class PokemonAbilityBffService extends BffBaseServiceAbstract<TPokemonAbility> {
  constructor(baseUrl: string) {
    super('pokemon.ability' ,baseUrl);
  }
}