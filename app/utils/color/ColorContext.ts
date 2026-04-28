'use client';
import { createContext } from 'react';

export type ColorType = 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'neutral';

export type ColorValue = {
  main: string;
  light?: string;
  dark?: string;
};

export type ColorContextType = {
  color: ColorType;
};

export const ColorContext = createContext<ColorContextType>({ color: 'primary' });

