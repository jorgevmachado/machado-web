import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TPokemonType } from '@/app/ui';

export class PokemonTypeBffService extends BffBaseServiceAbstract<TPokemonType> {
  constructor(baseUrl: string) {
    super('pokemon.type' ,baseUrl);
  }
}