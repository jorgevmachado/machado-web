import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TPokemonMove } from '@/app/ui/features/pokemon/move';

export class PokemonMoveBffService extends BffBaseServiceAbstract<TPokemonMove> {
  constructor(baseUrl: string) {
    super('pokemon.move', baseUrl);
  }
}