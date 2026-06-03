import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TPokedex } from '@/app/ui';

export class TrainerPokedexBffService extends BffBaseServiceAbstract<TPokedex> {
  constructor(baseUrl: string) {
    super('trainer.pokedex' ,baseUrl);
  }
}