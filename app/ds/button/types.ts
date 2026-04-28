import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { TTone } from '@/app/utils';

export type ButtonAppearance =
  | 'solid'
  | 'outline'
  | 'outlineBorderless'
  | 'icon'
  | 'iconNoBorder';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: ReactNode;
  appearance?: ButtonAppearance;
  tone?: TTone;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

