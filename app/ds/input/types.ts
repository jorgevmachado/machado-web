import { type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputVariant = 'outline' | 'filled' | 'ghost';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: InputVariant;
  size?: InputSize;
  isInvalid?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  showClearButton?: boolean;
  clearButtonAriaLabel?: string;
  onClear?: () => void;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  inputWrapperClassName?: string;
  helperClassName?: string;
};

