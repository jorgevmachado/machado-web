export type TSize =
  'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

export type TWeight =
  'bold'
  | 'thin'
  | 'black'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'extralight'
  | 'extrabold';

export type TBorderRadius =
   'xs'
   | 'sm'
   | 'md'
   | 'lg'
   | 'xl'
   | '2xl'
   | '3xl'
   | '4xl'
   | 'none'
   | 'full';

export type TShadow =
  '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'none';

export type TPadding =
  'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

export type TBackgroundColor =
  'white'
| 'slate-50'
| 'slate-100'
| 'slate-200'
| 'slate-900'
| 'blue-50'
| 'emerald-50'
| 'amber-50'
| 'rose-50'
| 'sky-50'
| 'violet-50'
| 'inherit'
| 'transparent';

export type TBorderColor =
   'slate-100'
  | 'slate-200'
  | 'slate-200/60'
  | 'slate-300'
  | 'slate-400'
  | 'blue-200'
  | 'emerald-200'
  | 'amber-200'
  | 'rose-200'
  | 'sky-200'
  | 'violet-200'
  | 'transparent'
  | 'none';

export type THover =
  'none'
| 'lift'
| 'shadow'
| 'scale';

export type TTone =
  | 'default'
  | 'muted'
  | 'white'
  | 'subtle'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'inherit';

export type TAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';

export type TTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export type TTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export type TLeading =
  | 'none'
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10';

export type TDecoration = 'none' | 'underline' | 'lineThrough' | 'overline';

export type TFontFamily = 'sans' | 'serif' | 'mono';

export type TDisplay = 'block' | 'inline' | 'inlineBlock';

export type TWhitespace = 'normal' | 'nowrap' | 'pre' | 'preLine' | 'preWrap' | 'breakSpaces';

export type TLineClamp = 1 | 2 | 3 | 4 | 5 | 6 | 'none';

export type TBreak = 'normal' | 'words' | 'all' | 'keep';

export type TWidth = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'screen';

export type TextWrap = 'wrap' | 'nowrap' | 'balance' | 'pretty';