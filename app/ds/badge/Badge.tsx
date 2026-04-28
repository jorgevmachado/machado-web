import React ,{ useMemo } from 'react';

import { joinClass } from '@/app/utils';

import {
  type BadgeProps ,
  type BadgeShape ,
  type BadgeSize ,
  type BadgeTone ,
  type BadgeVariant ,
} from './types';

const TONE_CLASS_MAP: Record<BadgeVariant ,Record<BadgeTone ,string>> = {
  solid: {
    primary: 'bg-blue-600 text-white' ,
    secondary: 'bg-slate-700 text-white' ,
    success: 'bg-emerald-500 text-white' ,
    warning: 'bg-amber-400 text-slate-900' ,
    danger: 'bg-red-500 text-white' ,
    info: 'bg-sky-500 text-white' ,
    neutral: 'bg-slate-200 text-slate-700' ,
  } ,
  soft: {
    primary: 'bg-blue-50 text-blue-700' ,
    secondary: 'bg-slate-100 text-slate-700' ,
    success: 'bg-emerald-50 text-emerald-700' ,
    warning: 'bg-amber-50 text-amber-700' ,
    danger: 'bg-red-50 text-red-700' ,
    info: 'bg-sky-50 text-sky-700' ,
    neutral: 'bg-slate-100 text-slate-600' ,
  } ,
  outline: {
    primary: 'border border-blue-500 bg-transparent text-blue-700' ,
    secondary: 'border border-slate-400 bg-transparent text-slate-700' ,
    success: 'border border-emerald-500 bg-transparent text-emerald-700' ,
    warning: 'border border-amber-400 bg-transparent text-amber-700' ,
    danger: 'border border-red-500 bg-transparent text-red-700' ,
    info: 'border border-sky-400 bg-transparent text-sky-700' ,
    neutral: 'border border-slate-300 bg-transparent text-slate-600' ,
  } ,
};

const SIZE_CLASS_MAP: Record<BadgeSize ,string> = {
  sm: 'h-5 px-2 text-xs' ,
  md: 'h-6 px-2.5 text-xs' ,
  lg: 'h-7 px-3 text-sm' ,
};

const SHAPE_CLASS_MAP: Record<BadgeShape ,string> = {
  rounded: 'rounded-md' ,
  pill: 'rounded-full' ,
};

const BADGE_TONES: BadgeTone[] = [
  'primary' ,
  'secondary' ,
  'success' ,
  'warning' ,
  'danger' ,
  'info' ,
  'neutral' ,
];

const getRandomTone = (): BadgeTone => {
  const randomIndex = Math.floor(Math.random() * BADGE_TONES.length);

  return BADGE_TONES[randomIndex];
};

const Badge = ({
  tone = 'primary' ,
  random = false ,
  size = 'md' ,
  variant = 'soft' ,
  shape = 'pill' ,
  children ,
  iconLeft ,
  iconRight ,
  className ,
  ...spanProps
}: BadgeProps) => {
  const resolvedTone = useMemo(() => {
    if (random) {
      return getRandomTone();
    }

    return tone;
  } ,[random ,tone]);

  return (
    <span
      { ...spanProps }
      className={ joinClass([
        'inline-flex items-center justify-center gap-1 font-semibold leading-none' ,
        SIZE_CLASS_MAP[size] ,
        SHAPE_CLASS_MAP[shape] ,
        TONE_CLASS_MAP[variant][resolvedTone] ,
        className ,
      ]) }
    >
      { iconLeft ?
        <span aria-hidden="true"
          className="inline-flex shrink-0">{ iconLeft }</span> :
        null }
      { children }
      { iconRight ?
        <span aria-hidden="true"
          className="inline-flex shrink-0">{ iconRight }</span> :
        null }
    </span>
  );
};

export default React.memo(Badge);

