import React from 'react';

export type StatusEnum = 'ACTIVE' | 'INACTIVE';

export type TUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  status: StatusEnum;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  total_authentications?: number;
  authentication_success?: number;
  authentication_failures?: number;
  last_authentication_at?: Date;
};

export type UserProviderProps = {
  children: React.ReactNode;
  initialUser?: TUser;
  tokenExpiresAt?: number;
  isAuthenticated: boolean;

};

export type UserContextValue = {
  user?: TUser;
  isLoading: boolean;
  clearUser: () => void;
  refreshUser: () => Promise<TUser | undefined>;
  isAuthenticated: boolean;
};
