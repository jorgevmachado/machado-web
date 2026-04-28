'use client';

import { createContext } from 'react';

import { UserContextValue } from './types';

export const UserContext = createContext<UserContextValue | null>(null);

