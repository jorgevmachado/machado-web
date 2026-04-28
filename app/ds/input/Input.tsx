'use client';

import React, { useCallback, useMemo } from 'react';

import { MdClose } from 'react-icons/md';

import { joinClass } from '@/app/utils';

import { type InputProps, type InputSize, type InputVariant } from './types';

const VARIANT_CLASS_MAP: Record<InputVariant, string> = {
  outline: 'border border-slate-200 bg-white text-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100',
  filled: 'border border-transparent bg-slate-100 text-slate-800 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
  ghost: 'border border-transparent bg-transparent text-slate-700 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
};

const SIZE_CLASS_MAP: Record<InputSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  variant = 'outline',
  size = 'md',
  isInvalid = false,
  isLoading = false,
  loadingText,
  helperText,
  errorMessage,
  leadingIcon,
  trailingIcon,
  fullWidth = true,
  showClearButton = false,
  clearButtonAriaLabel = 'Clear input',
  onClear,
  onValueChange,
  onChange,
  disabled,
  readOnly,
  value,
  placeholder,
  containerClassName,
  inputWrapperClassName,
  helperClassName,
  className,
  ...inputProps
}, ref) => {
  const hasValue = typeof value === 'string' && value.length > 0;

  const resolvedPlaceholder = isLoading && loadingText ? loadingText : placeholder;

  const wrapperClassName = useMemo(() => {
    return joinClass([
      'flex items-center gap-2 rounded-xl px-3 transition',
      SIZE_CLASS_MAP[size],
      VARIANT_CLASS_MAP[variant],
      isInvalid && 'border-red-400 focus-within:border-red-400 focus-within:ring-red-100',
      disabled && 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70',
      fullWidth && 'w-full',
      inputWrapperClassName,
    ]);
  }, [disabled, fullWidth, inputWrapperClassName, isInvalid, size, variant]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onValueChange?.(event.target.value, event);
  }, [onChange, onValueChange]);

  const handleClear = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }

    onClear?.();
  }, [disabled, onClear, readOnly]);

  const shouldShowClearButton = showClearButton && hasValue && !isLoading && !disabled && !readOnly;

  return (
    <div className={joinClass([fullWidth && 'w-full', containerClassName])}>
      <div className={wrapperClassName}>
        {leadingIcon ? (
          <span aria-hidden='true' className='inline-flex shrink-0 text-slate-500'>
            {leadingIcon}
          </span>
        ) : null}

        <input
          {...inputProps}
          ref={ref}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={resolvedPlaceholder}
          aria-invalid={isInvalid || undefined}
          aria-busy={isLoading || undefined}
          className={joinClass([
            'w-full bg-transparent outline-none placeholder:text-slate-400',
            'disabled:cursor-not-allowed',
            className,
          ])}
          onChange={handleChange}
        />

        {isLoading ? (
          <span
            aria-hidden='true'
            className='inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-400 border-t-transparent'
          />
        ) : null}

        {shouldShowClearButton ? (
          <button
            type='button'
            aria-label={clearButtonAriaLabel}
            onClick={handleClear}
            className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700'
          >
            <MdClose size={16} aria-hidden='true' />
          </button>
        ) : null}

        {!isLoading && !shouldShowClearButton && trailingIcon ? (
          <span aria-hidden='true' className='inline-flex shrink-0 text-slate-500'>
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {errorMessage ? (
        <p className={joinClass(['mt-1 text-xs font-medium text-red-600', helperClassName])} role='alert'>
          {errorMessage}
        </p>
      ) : null}

      {!errorMessage && helperText ? (
        <p className={joinClass(['mt-1 text-xs text-slate-500', helperClassName])}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default React.memo(Input);

