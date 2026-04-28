import { AuthService } from './service';
import { getBaseUrl } from '@/app/utils/url/url';

export const authService = (token?: string): AuthService => {
  return new AuthService(getBaseUrl(), token);
};