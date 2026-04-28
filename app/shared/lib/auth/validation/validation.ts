import { PASSWORD_PATTERN } from '../constants';

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return PASSWORD_PATTERN.test(password);
};

