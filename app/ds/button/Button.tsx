import React from 'react';

import { joinClass ,TTone } from '@/app/utils';

import {
  type ButtonAppearance,
  type ButtonProps,
  type ButtonSize,
} from './types';

const APPEARANCE_CLASS_MAP: Record<ButtonAppearance, Record<TTone, string>> = {
  solid: {
    info: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
    white: 'bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    muted: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
    subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    neutral: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400',
    warning: 'bg-amber-500 text-slate-950 hover:bg-amber-600 focus:ring-amber-500',
    inherit: 'bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'bg-slate-900 text-white hover:bg-slate-950 focus:ring-slate-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500',
  },
  outline: {
    info: 'border border-sky-600 bg-white text-sky-700 hover:bg-sky-50 focus:ring-sky-500',
    white: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    muted: 'border border-slate-600 bg-white text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
    subtle: 'border border-slate-100 bg-white text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'border border-red-600 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500',
    success: 'border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    neutral: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    warning: 'border border-amber-500 bg-white text-amber-700 hover:bg-amber-50 focus:ring-amber-500',
    inherit: 'border border-inherit bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'border border-slate-900 bg-white text-slate-900 hover:bg-slate-950 focus:ring-slate-500',
    primary: 'border border-blue-600 bg-white text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
    secondary: 'border border-slate-500 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
  },
  outlineBorderless: {
    info: 'border-0 bg-transparent text-sky-700 hover:bg-sky-50 focus:ring-sky-500',
    white: 'border-0 bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    muted: 'border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
    subtle: 'border-0 bg-transparent text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'border-0 bg-transparent text-red-700 hover:bg-red-50 focus:ring-red-500',
    success: 'border-0 bg-transparent text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    neutral: 'border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    warning: 'border-0 bg-transparent text-amber-700 hover:bg-amber-50 focus:ring-amber-500',
    inherit: 'border-0 bg-transparent text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'border-0 bg-transparent text-slate-900 hover:bg-slate-950 focus:ring-slate-500',
    primary: 'border-0 bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
    secondary: 'border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
  },
  icon: {
    info: 'rounded-full bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
    white: 'rounded-full bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    muted: 'rounded-full bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
    subtle: 'rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'rounded-full bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    neutral: 'rounded-full bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400',
    warning: 'rounded-full bg-amber-500 text-slate-950 hover:bg-amber-600 focus:ring-amber-500',
    inherit: 'rounded-full bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'rounded-full bg-slate-900 text-white hover:bg-slate-950 focus:ring-slate-500',
    primary: 'rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'rounded-full bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500',
  },
  iconNoBorder: {
    info: 'rounded-full border-0 bg-transparent text-sky-700 hover:bg-sky-50 focus:ring-sky-500',
    white: 'rounded-full border-0 bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    muted: 'rounded-full border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
    subtle: 'rounded-full border-0 bg-transparent text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'rounded-full border-0 bg-transparent text-red-700 hover:bg-red-50 focus:ring-red-500',
    success: 'rounded-full border-0 bg-transparent text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    neutral: 'rounded-full border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    warning: 'rounded-full border-0 bg-transparent text-amber-700 hover:bg-amber-50 focus:ring-amber-500',
    inherit: 'rounded-full border-0 bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'rounded-full border-0 bg-transparent text-slate-900 hover:bg-slate-950 focus:ring-slate-500',
    primary: 'rounded-full border-0 bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
    secondary: 'rounded-full border-0 bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500',
  },
};

const SIZE_CLASS_MAP: Record<ButtonSize, { default: string; iconOnly: string }> = {
  sm: {
    default: 'h-9 px-3 text-sm',
    iconOnly: 'h-9 w-9',
  },
  md: {
    default: 'h-10 px-4 text-sm',
    iconOnly: 'h-10 w-10',
  },
  lg: {
    default: 'h-11 px-5 text-base',
    iconOnly: 'h-11 w-11',
  },
};

const Button = ({
  children,
  appearance = 'solid',
  tone = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  isLoading = false,
  loadingText = 'Loading...',
  className,
  disabled,
  type = 'button',
  ...buttonProps
}: ButtonProps) => {
  const hasContent = Boolean(children);
  const hasSingleIcon = !hasContent && Boolean(iconLeft || iconRight);
  const isIconVariant = appearance === 'icon' || appearance === 'iconNoBorder';
  const sizeClassName = hasSingleIcon || isIconVariant
    ? SIZE_CLASS_MAP[size].iconOnly
    : SIZE_CLASS_MAP[size].default;

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={joinClass([
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-xl',
        'font-semibold',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'disabled:opacity-60',
        disabled ? 'cursor-not-allowed' :'cursor-pointer',
        APPEARANCE_CLASS_MAP[appearance][tone],
        sizeClassName,
        fullWidth && 'w-full',
        className,
      ])}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden='true'
            className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
          />
          {hasContent ? loadingText : null}
        </>
      ) : (
        <>
          {iconLeft ? <span aria-hidden='true' className='inline-flex shrink-0'>{iconLeft}</span> : null}
          {children ? <span>{children}</span> : null}
          {iconRight ? <span aria-hidden='true' className='inline-flex shrink-0'>{iconRight}</span> : null}
        </>
      )}
    </button>
  );
};

export default React.memo(Button);

