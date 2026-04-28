'use server';

import { redirect } from 'next/navigation';

import {
  isStrongPassword,
  PASSWORD_RULE_MESSAGE,
} from '@/app/shared/lib/auth';
import type { AuthActionState } from '@/app/shared/lib/auth/action-state';
import { clearAuthCookie, setAuthCookie } from '@/app/shared/lib/auth/server';
import type { ResponseError } from '@/app/shared/services/http';
import { authService } from '@/app/ui/features/auth/service';
import { SignInParams, SignUpParams } from '@/app/ui/features/auth/types';

const INVALID_CREDENTIAL_MESSAGE = 'Please enter your email or username.';
const INVALID_FULL_NAME_MESSAGE = 'Please enter your full name.';
const INVALID_BIRTH_DATE_MESSAGE = 'Please provide your birth date.';
const INVALID_GENDER_MESSAGE = 'Please select your gender.';
const INVALID_USERNAME_MESSAGE = 'Please enter a username.';
const PASSWORD_CONFIRMATION_MESSAGE = 'Password confirmation does not match.';
const DEFAULT_LOGIN_ERROR_MESSAGE = 'Unable to sign in. Please try again.';

type RegisterUserPayload = {
  email: string;
  username: string;
  fullName: string;
  birthDate: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

const getStringValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
};

const toErrorState = (message: string): AuthActionState => {
  return {
    status: 'error',
    message,
  };
};

const readLoginPayload = (formData: FormData): SignInParams => {
  return {
    credential: getStringValue(formData, 'credential'),
    password: getStringValue(formData, 'password'),
  };
};

const readRegisterPayload = (formData: FormData): RegisterUserPayload => {
  return {
    email: getStringValue(formData, 'email'),
    username: getStringValue(formData, 'username'),
    fullName: getStringValue(formData, 'fullName'),
    birthDate: getStringValue(formData, 'birthDate'),
    gender: getStringValue(formData, 'gender'),
    password: getStringValue(formData, 'password'),
    confirmPassword: getStringValue(formData, 'confirmPassword'),
  };
};

const validateLoginPayload = ({ credential, password }: SignInParams): AuthActionState | null => {
  if (!credential || credential.length === 0) {
    return toErrorState(INVALID_CREDENTIAL_MESSAGE);
  }

  if (!isStrongPassword(password)) {
    return toErrorState(PASSWORD_RULE_MESSAGE);
  }

  return null;
};

const validateRegisterPayload = ({
  email,
  username,
  fullName,
  birthDate,
  gender,
  password,
  confirmPassword,
}: RegisterUserPayload): AuthActionState | null => {
  if (!fullName || fullName.length < 3) {
    return toErrorState(INVALID_FULL_NAME_MESSAGE);
  }

  if (!email || !email.includes('@')) {
    return toErrorState('Please enter a valid email address.');
  }

  if (!username || username.length === 0) {
    return toErrorState(INVALID_USERNAME_MESSAGE);
  }

  if (!birthDate) {
    return toErrorState(INVALID_BIRTH_DATE_MESSAGE);
  }

  if (!gender) {
    return toErrorState(INVALID_GENDER_MESSAGE);
  }

  if (!isStrongPassword(password)) {
    return toErrorState(PASSWORD_RULE_MESSAGE);
  }

  if (password !== confirmPassword) {
    return toErrorState(PASSWORD_CONFIRMATION_MESSAGE);
  }

  return null;
};

const mapLoginError = (error: unknown): AuthActionState => {
  const responseError = error as ResponseError | undefined;
  const message = responseError?.message || DEFAULT_LOGIN_ERROR_MESSAGE;

  return toErrorState(message);
};

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const credentials = readLoginPayload(formData);
  const validationError = validateLoginPayload(credentials);

  if (validationError) {
    return validationError;
  }

  try {
    const service = authService();
    const token = await service.login(credentials);

    await setAuthCookie(token);
  } catch (error) {
    return mapLoginError(error);
  }

  redirect('/home');
}

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const payload = readRegisterPayload(formData);
  const validationError = validateRegisterPayload(payload);

  if (validationError) {
    return validationError;
  }

  try {
    const service = authService();
    await service.register({
      name: payload.fullName,
      username: payload.username,
      email: payload.email,
      gender: payload.gender,
      password: payload.password,
      date_of_birth: payload.birthDate,
    } satisfies SignUpParams);
  } catch (error) {
    return mapLoginError(error);
  }

  return {
    status: 'success',
    message: 'Account created! Please log in.',
  };
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
}
