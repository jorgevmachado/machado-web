import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  TTrainerParty,
  TTrainerPartyFilters,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class TrainerPartyService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'trainer/party', token);
  }

  public async list(params: TTrainerPartyFilters & { page?: string; limit?: string }): Promise<TPaginatedListResponse<TTrainerParty>> {
    return await this.get<TPaginatedListResponse<TTrainerParty>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<TTrainerParty> {
    return await this.get<TTrainerParty>(`${this.pathUrl}/${identifier}`);
  }
}