import {
  TAlign ,
  TBackgroundColor ,
  TBorderColor ,
  TBorderRadius ,TBreak ,TDecoration ,TDisplay ,
  type TextWrap ,TFontFamily ,THover ,TLeading ,
  TLineClamp ,
  TPadding ,
  TShadow ,TSize ,TTone ,TTracking ,TTransform ,
  TWeight ,TWhitespace ,TWidth ,
} from './types';

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

export const LEADING_CLASS_MAP: Record<TLeading, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
  '3': 'leading-3',
  '4': 'leading-4',
  '5': 'leading-5',
  '6': 'leading-6',
  '7': 'leading-7',
  '8': 'leading-8',
  '9': 'leading-9',
  '10': 'leading-10',
};

export const TRACKING_CLASS_MAP: Record<TTracking, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

export const TRANSFORM_CLASS_MAP: Record<TTransform, string> = {
  none: 'normal-case',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
};

export const TEXT_SIZE_CLASS_MAP: Record<TSize ,string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
};

export const TEXT_TONE_CLASS_MAP: Record<TTone ,string> = {
  info: 'text-sky-600',
  muted: 'text-slate-600',
  white: 'text-white',
  subtle: 'text-slate-500',
  danger: 'text-rose-600',
  default: 'text-slate-900',
  primary: 'text-blue-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  neutral: 'text-slate-700',
  inherit: 'text-inherit',
  secondary: 'text-violet-600',
};

export const TEXT_ALIGN_CLASS_MAP: Record<TAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
  start: 'text-start',
  end: 'text-end',
};

export const HOVER_EFFECT_CLASS_MAP: Record<THover, string> = {
  none: '',
  lift: 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1',
  shadow: 'transition-shadow duration-300 hover:shadow-xl',
  scale: 'transition-transform duration-300 hover:scale-105',
};

export const BORDER_COLOR_CLASS_MAP: Record<TBorderColor ,string> = {
  'slate-100': 'border-slate-100' ,
  'slate-200': 'border-slate-200' ,
  'slate-200/60': 'border-slate-200/60' ,
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

export const DECORATION_CLASS_MAP: Record<TDecoration, string> = {
  none: 'no-underline',
  underline: 'underline',
  lineThrough: 'line-through',
  overline: 'overline',
};

export const FONT_FAMILY_CLASS_MAP: Record<TFontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

export const DISPLAY_CLASS_MAP: Record<TDisplay, string> = {
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
};

export const WHITESPACE_CLASS_MAP: Record<TWhitespace, string> = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  preLine: 'whitespace-pre-line',
  preWrap: 'whitespace-pre-wrap',
  breakSpaces: 'whitespace-break-spaces',
};

export const LINE_CLAMP_CLASS_MAP: Record<TLineClamp, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
  none: 'line-clamp-none',
};

export const BREAK_CLASS_MAP: Record<TBreak, string> = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
  keep: 'break-keep',
};

export const WRAP_CLASS_MAP: Record<TextWrap, string> = {
  wrap: 'text-wrap',
  nowrap: 'text-nowrap',
  balance: 'text-balance',
  pretty: 'text-pretty',
};

export const WIDTH_CLASS_MAP: Record<TWidth, string> = {
  '3xs': 'max-w-3xs',
  '2xs': 'max-w-2xs',
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  screen: 'max-w-screen',
};