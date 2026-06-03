import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TOwnedPokemon } from '@/app/ui';

export class TrainerOwnedPokemonBffService extends BffBaseServiceAbstract<TOwnedPokemon> {
  constructor(baseUrl: string) {
    super('trainer.owned-pokemon' ,baseUrl);
  }
}