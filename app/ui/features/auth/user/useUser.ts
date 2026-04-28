'use client';

import { useContext } from 'react';

import { UserContext } from './UserContext';
import { UserContextValue } from './types';

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider.');
  }

  return context;
};

