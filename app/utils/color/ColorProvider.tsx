'use client';
import React, { useMemo } from 'react';
import { ColorContext, ColorType } from './ColorContext';

type ColorProviderProps = Readonly<{
  children: React.ReactNode;
  color?: ColorType;
}>;

export const ColorProvider = ({ children, color = 'primary' }: ColorProviderProps) => {
  const value = useMemo(() => ({ color }), [color]);
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};
