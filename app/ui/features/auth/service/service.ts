import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import { extractAuthToken } from '@/app/shared/lib/auth/token/token';
import {
  LoginResponsePayload ,
  SignInParams ,
  SignUpParams,
  RegisterResponse,
} from '@/app/ui/features/auth/types';
import { TUser } from '@/app/ui/features/auth/user/types';

export class AuthService extends BaseServiceAbstract {

  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'auth', token);
  }

  public async login(params: SignInParams): Promise<string> {
    const response = await this.post<SignInParams, LoginResponsePayload>(`${this.pathUrl}/login`, {
      body: params,
    });

    return extractAuthToken(response);
  }

  public async me(): Promise<TUser> {
    return await this.get<TUser>(`${this.pathUrl}/me`);
  }

  public async register(payload: SignUpParams): Promise<RegisterResponse> {
    return await this.post<SignUpParams, RegisterResponse>(`${this.pathUrl}/register`, {
      body: payload,
    });
  }
}