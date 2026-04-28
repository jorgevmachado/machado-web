'use client';
import React from 'react';
import { joinClass, ColorProvider, ColorType } from '@/app/utils';
import Pokeball from './pokeball';
import Circle from './circle';
import Bar from './bar';
import Dots from './dots';
import { SpinnerSize, TSpinner } from './types';

type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  type?: TSpinner;
  overlay?: boolean;
  color?: ColorType;
};

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

const barSizeClass: Record<SpinnerSize, string> = {
  sm: 'h-2 w-32',
  md: 'h-3 w-48',
  lg: 'h-4 w-64',
};

const dotsSizeClass: Record<SpinnerSize, string> = {
  sm: 'h-3 w-20',
  md: 'h-4 w-32',
  lg: 'h-6 w-48',
};

export default function Spinner({
  size = 'md',
  type = 'pokeball',
  overlay = false,
  color = 'primary',
}: SpinnerProps) {
  const className = joinClass([
    overlay
      ? 'fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]'
      : 'flex items-center justify-center py-8',
  ]);

  const getSizeClassName = () => {
    if (type === 'bar') return `${barSizeClass[size]} drop-shadow-md`;
    if (type === 'dots') return `${dotsSizeClass[size]} drop-shadow-md`;
    return `${sizeClass[size]} animate-[pokeball-spin_0.85s_linear_infinite] drop-shadow-md`;
  };

  return (
    <ColorProvider color={color}>
      <div aria-live="polite" className={className}>
        <div
          role="status"
          aria-label="loading"
          className={getSizeClassName()}
        >
          {type === 'pokeball' && <Pokeball />}
          {type === 'circle' && <Circle />}
          {type === 'bar' && <Bar />}
          {type === 'dots' && <Dots />}
        </div>
      </div>
    </ColorProvider>
  );
}