import {
  BffBaseServiceAbstract ,
} from '@/app/shared/services/bff-service';
import { __DOMAIN_TYPE__ } from '@/app/ui';

export class __DOMAIN_BFF_SERVICE__ extends BffBaseServiceAbstract<__DOMAIN_TYPE__> {
  constructor(baseUrl: string) {
    super('__DOMAIN_TRANSLATE__' ,baseUrl);
  }
}