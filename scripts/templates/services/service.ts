import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import {
  __DOMAIN_TYPE__,
  __DOMAIN_TYPE__FILTERS__,
} from '@/app/ui';
import { TPaginatedListResponse } from '@/app/ds';


export class __DOMAIN_SERVICE__ extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, '__DOMAIN_PATH__', token);
  }

  public async list(params: __DOMAIN_TYPE__FILTERS__ & { page?: string; limit?: string }): Promise<TPaginatedListResponse<__DOMAIN_TYPE__>> {
    return await this.get<TPaginatedListResponse<__DOMAIN_TYPE__>>(this.pathUrl, { params });
  }

  public async detail(identifier: string): Promise<__DOMAIN_TYPE__> {
    return await this.get<__DOMAIN_TYPE__>(`${this.pathUrl}/${identifier}`);
  }
}