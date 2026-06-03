import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TPokemonMove } from '@/app/ui';

export class PokemonMoveBffService extends BffBaseServiceAbstract<TPokemonMove> {
  constructor(baseUrl: string) {
    super('pokemon.move' ,baseUrl);
  }
}