'use client';
import React from 'react';
import { ColorContext, ColorType } from './ColorContext';

type ColorProviderProps = {
  children: React.ReactNode;
  color?: ColorType;
};

export const ColorProvider = ({ children, color = 'primary' }: ColorProviderProps) => {
  return <ColorContext.Provider value={{ color }}>{children}</ColorContext.Provider>;
};

