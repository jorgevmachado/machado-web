import { StatusEnum } from './user/types';
import type { TTrainer } from '@/app/ui/features/trainer';

export type SignUpParams = {
  name: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  date_of_birth: string;
}

export type SignInParams = {
  credential: string;
  password: string;
}

export type LoginResponsePayload = {
  token_type: string;
  access_token: string;
}

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  status: StatusEnum;
  trainer?: TTrainer;
  username: string;
  created_at: string;
};
