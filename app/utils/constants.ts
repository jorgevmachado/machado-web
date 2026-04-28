import {
  TBackgroundColor ,
  TBorderColor ,
  TBorderRadius ,THover ,
  TPadding ,
  TShadow ,
  TWeight ,
} from '@/app/utils/types';

export const BORDER_RADIUS_CLASS_MAP: Record<TBorderRadius ,string> = {
  xs: 'rounded-xs' ,
  sm: 'rounded-sm' ,
  md: 'rounded-md' ,
  lg: 'rounded-lg' ,
  xl: 'rounded-xl' ,
  '2xl': 'rounded-2xl' ,
  '3xl': 'rounded-3xl' ,
  '4xl': 'rounded-4xl' ,
  'none': 'rounded-none' ,
  full: 'rounded-full' ,
};

export const BORDER_COLOR_CLASS_MAP: Record<TBorderColor ,string> = {
  'slate-100': 'border-slate-100' ,
  'slate-200': 'border-slate-200' ,
  'slate-300': 'border-slate-300' ,
  'slate-400': 'border-slate-400' ,
  'blue-200': 'border-blue-200' ,
  'emerald-200': 'border-emerald-200' ,
  'amber-200': 'border-amber-200' ,
  'rose-200': 'border-rose-200' ,
  'sky-200': 'border-sky-200' ,
  'violet-200': 'border-violet-200' ,
  transparent: 'border-transparent' ,
  none: 'border-none' ,
};

export const WEIGHT_CLASS_MAP: Record<TWeight ,string> = {
  bold: 'font-bold' ,
  thin: 'font-thin' ,
  black: 'font-black' ,
  light: 'font-light' ,
  normal: 'font-normal' ,
  medium: 'font-medium' ,
  semibold: 'font-semibold' ,
  extralight: 'font-extralight' ,
  extrabold: 'font-extrabold' ,
};

export const SHADOW_CLASS_MAP: Record<TShadow ,string> = {
  xs: 'shadow-xs' ,
  sm: 'shadow-sm' ,
  md: 'shadow-md' ,
  lg: 'shadow-lg' ,
  xl: 'shadow-xl' ,
  '2xs': 'shadow-2xs' ,
  '2xl': 'shadow-2xl' ,
  'none': 'shadow-none',
};

export const PADDING_CLASS_MAP: Record<TPadding ,string> = {
  xs: 'p-2' ,
  sm: 'p-3' ,
  md: 'p-4' ,
  lg: 'p-6' ,
  xl: 'p-8' ,
};

export const BACKGROUND_COLOR_CLASS_MAP: Record<TBackgroundColor ,string> = {
  white: 'bg-white' ,
  'slate-50': 'bg-slate-50' ,
  'slate-100': 'bg-slate-100' ,
  'slate-200': 'bg-slate-200' ,
  'slate-900': 'bg-slate-900' ,
  'blue-50': 'bg-blue-50' ,
  'emerald-50': 'bg-emerald-50' ,
  'amber-50': 'bg-amber-50' ,
  'rose-50': 'bg-rose-50' ,
  'sky-50': 'bg-sky-50' ,
  'violet-50': 'bg-violet-50' ,
  inherit: 'bg-inherit' ,
  transparent: 'bg-transparent' ,
};

export const HOVER_EFFECT_CLASS_MAP: Record<THover, string> = {
  none: '',
  lift: 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1',
  shadow: 'transition-shadow duration-300 hover:shadow-xl',
  scale: 'transition-transform duration-300 hover:scale-105',
};