import { type ComponentPropsWithoutRef ,type ReactNode } from 'react';

import type {
  TAlign ,
  TBreak ,
  TDecoration ,
  TDisplay ,
  TextWrap ,
  TFontFamily ,
  TLeading ,
  TLineClamp ,
  TSize ,
  TTone ,
  TTracking ,
  TTransform ,
  TWeight ,
  TWhitespace,
} from '@/app/utils';

export type TextTag =
  | 'blockquote'
  | 'code'
  | 'div'
  | 'em'
  | 'figcaption'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'legend'
  | 'mark'
  | 'p'
  | 'small'
  | 'span'
  | 'strong';

type TextOwnProps<T extends TextTag = 'p'> = {
  as?: T;
  children: ReactNode;
  size?: TSize;
  weight?: TWeight;
  tone?: TTone;
  align?: TAlign;
  color?: string;
  transform?: TTransform;
  tracking?: TTracking;
  leading?: TLeading;
  decoration?: TDecoration;
  fontFamily?: TFontFamily;
  display?: TDisplay;
  wrap?: TextWrap;
  whitespace?: TWhitespace;
  breakStrategy?: TBreak;
  lineClamp?: TLineClamp;
  italic?: boolean;
  truncate?: boolean;
  srOnly?: boolean;
  className?: string;
};

export type TextProps<T extends TextTag = 'p'> =
  TextOwnProps<T>
  & Omit<ComponentPropsWithoutRef<T> ,keyof TextOwnProps<T>>;

export type TextTagProps = {
  tone?: TTone;
  size?: TSize;
  color?: string;
  weight?: TWeight;
  leading?: TLeading;
  tracking?: TTracking;
  className?: string;
  fontFamily?: TFontFamily;
}