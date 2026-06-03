import {
  BffBaseServiceAbstract ,BffDetailResponse ,
} from '@/app/shared/services/bff-service';
import { TActiveTrainerEncounterParams ,TTrainerEncounter } from '@/app/ui';

export class TrainerEncounterBffService extends BffBaseServiceAbstract<TTrainerEncounter> {
  constructor(baseUrl: string) {
    super('trainer.encounter' ,baseUrl);
  }

  public active = async (params: TActiveTrainerEncounterParams): Promise<BffDetailResponse<TTrainerEncounter>> => {
    return await this.bff_path<TActiveTrainerEncounterParams ,TTrainerEncounter>(
      '/active' ,
      { body: params } ,
    );
  };
}