import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TActiveTrainerEncounterParams ,
  TTrainerEncounter ,
  TTrainerEncounterFilters ,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerEncounterService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/encounter', token);
  }

  public async list(params: TTrainerEncounterFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TTrainerEncounter>> {
    return await this.get<TPaginatedListResponse<TTrainerEncounter>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TTrainerEncounter> {
    return await this.get<TTrainerEncounter>(`${this.pathUrl}/${identifier}`);
  }

  public async active(params: TActiveTrainerEncounterParams): Promise<TTrainerEncounter> {
    return await this.path<TActiveTrainerEncounterParams, TTrainerEncounter>(
      `${this.pathUrl}/active`,
      { body: params },
    );
  }
}