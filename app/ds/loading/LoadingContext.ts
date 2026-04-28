'use client';

import { createContext } from 'react';

import type { LoadingContextValue } from './types';

export const LoadingContext = createContext<LoadingContextValue | null>(null);

