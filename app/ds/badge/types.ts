import React ,{ type HTMLAttributes, type ReactNode } from 'react';

export type BadgeTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'solid' | 'soft' | 'outline';

export type BadgeShape = 'rounded' | 'pill';

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  tone?: BadgeTone;
  random?: boolean;
  size?: BadgeSize;
  shape?: BadgeShape;
  style?: React.CSSProperties;
  variant?: BadgeVariant;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

