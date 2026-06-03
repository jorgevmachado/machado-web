import { getBaseUrl } from '@/app/utils';

import {
  __DOMAIN_SERVICE__
} from './service';

export const __DOMAIN_FUNCTION_SERVICE__ = (token?: string): __DOMAIN_SERVICE__ => {
  return new __DOMAIN_SERVICE__(getBaseUrl(), token);
};