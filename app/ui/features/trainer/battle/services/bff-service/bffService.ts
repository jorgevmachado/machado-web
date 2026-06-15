import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TTrainerBattle } from '@/app/ui';

export class TrainerBffBattleService extends BffBaseServiceAbstract<TTrainerBattle> {
  constructor(baseUrl: string) {
    super('battle' ,baseUrl);
  }
}