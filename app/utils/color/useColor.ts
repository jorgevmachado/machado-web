'use client';
import { useContext } from 'react';
import { ColorContext } from './ColorContext';
import { colorMap } from './colorMap';

export const useColor = () => {
  const { color } = useContext(ColorContext);
  return colorMap[color];
};

