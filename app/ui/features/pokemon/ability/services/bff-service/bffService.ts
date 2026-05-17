import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TPokemonAbility } from '@/app/ui/features/pokemon/ability';

export class PokemonAbilityBffService extends BffBaseServiceAbstract<TPokemonAbility> {
  constructor(baseUrl: string) {
    super('pokemon.ability', baseUrl);
  }
}