import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { TTrainerParty } from '@/app/ui';

export class TrainerPartyBffService extends BffBaseServiceAbstract<TTrainerParty> {
  constructor(baseUrl: string) {
    super('trainer.party' ,baseUrl);
  }
}