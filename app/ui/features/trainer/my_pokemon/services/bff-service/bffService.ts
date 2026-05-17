import { BffBaseServiceAbstract } from '@/app/shared/services/bff-service';
import { TMyPokemon } from '@/app/ui';


export class MyPokemonBffService extends BffBaseServiceAbstract<TMyPokemon> {
  constructor(baseUrl: string) {
    super('myPokemon', baseUrl);
  }
}