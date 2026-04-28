import { type HTMLAttributes ,type ReactNode } from 'react';

import {
  type TBackgroundColor ,
  type TBorderColor ,
  type TBorderRadius ,
  type THover ,
  type TPadding ,
  type TShadow ,
} from '@/app/utils';

export type CardVariant = 'elevated' | 'filled' | 'outlined' | 'tonal' | 'none';

export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

export type CardProps = Omit<HTMLAttributes<HTMLDivElement> ,'children'> & {
  children: ReactNode;
  variant?: CardVariant;
  padding?: TPadding;
  rounded?: TBorderRadius;
  shadow?: TShadow;
  backgroundColor?: TBackgroundColor;
  borderColor?: TBorderColor;
  borderWidth?: 0 | 1 | 2;
  hoverEffect?: THover;
  interactive?: boolean;
  as?: 'article' | 'div' | 'section';
};



